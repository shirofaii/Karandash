var React = require('react');
var Redux = require('react-redux');
var _ = require('lodash');
import {sideInTiles, tileInPixels, sideInPixels} from './const.js'

export class Plotter {
    constructor(props) {
        this.props = this.props
        
        var polygonsBitmap = new MarkedPolygonsBitmap()
        polygonsBitmap.make(props)
        polygonsBitmap.markCorners()
        this.polygons = polygonsBitmap.polygons
    }
    
    svg() {
        return _.map(this.polygons, p => p.svgPath(p))
    }
}

class Point {
    // coords chunk based, pixels
    constructor(x, y, type, acuteAngle) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.acuteAngle = acuteAngle
    }
}

class Polygon {
    constructor(id) {
        this.id = id
        this.points = []
        this.pointsX = {}
        this.pointsY = {}
    }
    
    line(startPoint) {
        var point = startPoint
        point.visited = true
        var result = [point]
        var direction = 'r'
        do {
            point = this.nextFrom(point, direction)
            point.visited = true
            if(direction === 'r' || direction === 'l') {
                direction = point.type.charAt(0)
            } else if(direction === 't' || direction === 'b') {
                direction = point.type.charAt(1)
            }
            if(point !== startPoint) {
                result.push(point)
            }
        } while (point !== startPoint)
        return result
    }
    
    add(x, y, type, acuteAngle) {
        if(_.find(this.points, p => p.x === x && p.y === y && p.type === type)) return
        
        var p = new Point(x, y, type, acuteAngle)
        this.points.push(p)
        
        if(!this.pointsX[x]) {this.pointsX[x] = []}
        var a = this.pointsX[x]
        a.splice(_.sortedIndexBy(a, p, 'y'), 0, p);
        
        if(!this.pointsY[y]) {this.pointsY[y] = []}
        a = this.pointsY[y]
        a.splice(_.sortedIndexBy(a, p, 'x'), 0, p);
        
        return p
    }
    
    nextFrom(p, direction) {
        switch(direction) {
            case 'r': return this.rightFrom(p)
            case 'l': return this.leftFrom(p)
            case 't': return this.topFrom(p)
            case 'b': return this.bottomFrom(p)
        }
    }
    
    leftFrom(p) {
        const points = this.pointsY[p.y]
        var idx = _.indexOf(points, p) - 1
        if(idx >= 0) {
            return points[idx]
        }
    }
    
    rightFrom(p) {
        const points = this.pointsY[p.y]
        var idx = _.indexOf(points, p) + 1
        if(idx < points.length) {
            return points[idx]
        }
    }
    
    topFrom(p) {
        const points = this.pointsX[p.x]
        var idx = _.indexOf(points, p) - 1
        if(idx >= 0) {
            return points[idx]
        }
    }
    
    bottomFrom(p) {
        const points = this.pointsX[p.x]
        var idx = _.indexOf(points, p) + 1
        if(idx < points.length) {
            return points[idx]
        }
    }
    
    makeLines() {
        var lines = [ this.line(_.find(this.points, x => x.type === 'br')) ]
        while(!_.every(this.points, 'visited')) {
            var hole = this.line(_.find(this.points, x => !x.visited && x.type === 'br'))
            lines.push(hole)
        }
        return lines
    }
    
    path(line) {
        var p = line[0]
        var path = 'M' + p.x + ',' + p.y
        for(var i = 1; i < line.length; i++) {
            p = line[i]
            path += 'L' + p.x + ',' + p.y
        }
        path += 'z'
        return path
    }
    
    reversedPath(line) {
        var p = line[line.length - 1]
        var path = 'M' + p.x + ',' + p.y
        for(var i = line.length - 2; i >= 0; i--) {
            p = line[i]
            path += 'L' + p.x + ',' + p.y
        }
        path += 'z'
        return path
    }
    
    svgPath() {
        var lines = this.makeLines()
        var outer = lines[0]
        var path = this.path(outer)
        for(var i = 1; i < lines.length; i++) {
            path += this.reversedPath(lines[i])
        }
        return <path d={path} fill='url(#wallPattern)' stroke='black' strokeWidth='1' key={outer[0].x + ':' + outer[0].y} />
    }
}

class MarkedPolygonsBitmap {
    make(props) {
        // make helper bitmap for marking all polygons
        // required for svg path plotting
        // 0 - floor
        // 1..n polygon id
        
        this.markedPolygons = new Uint8Array((sideInTiles+2)*(sideInTiles+2))
        this.props = props
        var polygonId = 1
        this.polygons = []
        
        var i = -1
        for(var y = -1; y <= sideInTiles; y++) {
            for(var x = -1; x <= sideInTiles; x++) {
                i++
                var e = this.getTile(x, y)
                if(e !== 0 || this.markedPolygons[i] !== 0) continue
                
                this.wave(polygonId, x, y)
                this.polygons.push(new Polygon(polygonId))
                polygonId++
            }
        }
    }
    
    wave(id, x, y) {
        if(x < -1 || x >= sideInTiles + 1 || y < -1 || y >= sideInTiles + 1) return
        var i = (y+1) * (sideInTiles+2) + (x+1)
        if(this.markedPolygons[i] !== 0 || this.getTile(x, y) !== 0) return
        
        this.markedPolygons[i] = id
        this.wave(id, x + 1, y)
        this.wave(id, x - 1, y)
        this.wave(id, x, y + 1)
        this.wave(id, x, y - 1)
    }
    
    markCorners() {
        var i = -1
        for(var y = -1; y <= sideInTiles; y++) {
            for(var x = -1; x <= sideInTiles; x++) {
                i++
                const e = this.getTile(x, y)
                if(e !== 0) continue;
                var polygon = this.polygons[this.markedPolygons[i] - 1]
                this.addCornersForTile(polygon, x, y)
            }
        }
    }
    
    // x, y in chunk space
    getTile(x, y) {
        const sx = this.props.x * sideInTiles
        const sy = this.props.y * sideInTiles
        
        if(x < -1 || x > sideInTiles || y < -1 || y > sideInTiles)
            return 1
        
        return this.props.bitmap.getTile(sx + x, sy + y)
    }
    
    addCornersForTile(polygon, x, y) {
        const df = tileInPixels / 4
        
        const cx = x * tileInPixels + tileInPixels / 2
        const cy = y * tileInPixels + tileInPixels / 2

        var r = this.getTile(x + 1, y) !== 0
        var b = this.getTile(x, y + 1) !== 0
        var l = this.getTile(x - 1, y) !== 0
        var t = this.getTile(x, y - 1) !== 0

        if(t && l) {
            polygon.add(cx - df, cy - df, 'br', true)
        } else if(!t && !l && this.getTile(x - 1, y - 1) !== 0) {
            polygon.add(cx - df, cy - df, 'tl', false)
        }
        
        if(t && r) {
            polygon.add(cx + df, cy - df, 'bl', true)
        } else if(!t && !r && this.getTile(x + 1, y - 1) !== 0) {
            polygon.add(cx + df, cy - df, 'tr', false)
        }
        
        if(b && l) {
            polygon.add(cx - df, cy + df, 'tr', true)
        } else if(!b && !l && this.getTile(x - 1, y + 1) !== 0) {
            polygon.add(cx - df, cy + df, 'bl', false)
        }
        
        if(r && b) {
            polygon.add(cx + df, cy + df, 'tl', true)
        } else if(!r && !b && this.getTile(x + 1, y + 1) !== 0) {
            polygon.add(cx + df, cy + df, 'br', false)
        }
    }
}
