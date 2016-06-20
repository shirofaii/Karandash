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
    
    debugPolygons() {
        return _.map(this.polygons, p => this.debugLine(p.outerLine()))
    }
    
    debugLine(line) {
        var p = line[0]
        var path = 'M' + p.x + ',' + p.y
        for(var i = 1; i < line.length; i++) {
            p = line[i]
            path += 'L' + p.x + ',' + p.y
        }
        path += 'z'
        return <path d={path} fill='url(#wallPattern)' stroke='yellow' stroke-width='5' key={line[0].x + ':' + line[0].y} />
    }
    
    debugCorners() {
        return _.flatten(_.map(this.polygons, p => p.debugCorners()))
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
    
    path() {
        var d = 'M'
        d += this.x + ',' + this.y
        if(this.type.charAt(0) === 't')
            d += 'l0,-5l0,5';
        if(this.type.charAt(0) === 'b')
            d += 'l0,5l0,-5';
        if(this.type.charAt(1) === 'r')
            d += 'l5,0l-5,0';
        if(this.type.charAt(1) === 'l')
            d += 'l-5,0l5,0';
        return d
    }
    
    drawCorner() {
        var color = this.invisible ? 'blue' : 'red'
        return <path d={this.path()} fill='none' stroke={color} stroke-width='5' key={this.x + ':' + this.y} />
    }
}

class Polygon {
    constructor(id) {
        this.id = id
        this.corners = new Corners(id)
    }
    
    line(startPoint) {
        var point = startPoint
        var result = [point]
        var direction = 'r'
        do {
            point = this.corners.nextFrom(point, direction)
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
    
    outerLine() {
        return this.line(_.find(this.corners.points, x => x.type === 'br'))
    }
    
    debugCorners() {
        return this.corners.debugCorners()
    }
}

class MarkedPolygonsBitmap {
    make(props) {
        // make helper bitmap for marking all polygons
        // required for svg path plotting
        // 0 - floor
        // 1..n polygon id
        
        this.markedPolygons = new Uint8Array(sideInTiles*sideInTiles)
        this.props = props
        var polygonId = 1
        this.polygons = []
        
        for(var i = 0; i < sideInTiles*sideInTiles; i++) {
            var e = props.chunk[i]
            if(e !== 0 || this.markedPolygons[i] !== 0) continue
            
            var x = i % sideInTiles
            var y = Math.trunc(i / sideInTiles)
            this.wave(polygonId, x, y)
            this.polygons.push(new Polygon(polygonId))
            polygonId++
        }
    }
    
    wave(id, x, y) {
        if(x < 0 || x >= sideInTiles || y < 0 || y >= sideInTiles) return
        const i = y * sideInTiles + x
        if(this.markedPolygons[i] !== 0 || this.props.chunk[i] !== 0) return
        
        this.markedPolygons[i] = id
        this.wave(id, x + 1, y)
        this.wave(id, x - 1, y)
        this.wave(id, x, y + 1)
        this.wave(id, x, y - 1)
    }
    
    markCorners() {
        const sx = this.props.x * sideInTiles
        const sy = this.props.y * sideInTiles
        
        var i = -1
        for(var y = sy; y < sy + sideInTiles; y++) {
            for(var x = sx; x < sx + sideInTiles; x++) {
                i++
                const e = this.props.chunk[i]
                if(e !== 0) continue;
                
                this.addCornersForTile(x, y, i)
            }
        }
        _.forEach(this.polygons, p => p.corners.markChunkEdges())
    }
    
    addCornersForTile(x, y, i) {
        const sx = this.props.x * sideInTiles
        const sy = this.props.y * sideInTiles
        const df = 10
        
        var polygon = this.polygons[this.markedPolygons[i] - 1]
        
        const cx = (x - sx) * tileInPixels + tileInPixels / 2
        const cy = (y - sy) * tileInPixels + tileInPixels / 2

        const r = this.props.bitmap.getTile(x + 1, y) !== 0
        const b = this.props.bitmap.getTile(x, y + 1) !== 0
        const l = this.props.bitmap.getTile(x - 1, y) !== 0
        const t = this.props.bitmap.getTile(x, y - 1) !== 0

        if(t && l) {
            polygon.corners.add(cx - df, cy - df, 'br', true)
        } else if(!t && !l && this.props.bitmap.getTile(x - 1, y - 1) !== 0) {
            polygon.corners.add(cx - df, cy - df, 'tl', false)
        }
        
        if(t && r) {
            polygon.corners.add(cx + df, cy - df, 'bl', true)
        } else if(!t && !r && this.props.bitmap.getTile(x + 1, y - 1) !== 0) {
            polygon.corners.add(cx + df, cy - df, 'tr', false)
        }
        
        if(b && l) {
            polygon.corners.add(cx - df, cy + df, 'tr', true)
        } else if(!b && !l && this.props.bitmap.getTile(x - 1, y + 1) !== 0) {
            polygon.corners.add(cx - df, cy + df, 'bl', false)
        }
        
        if(r && b) {
            polygon.corners.add(cx + df, cy + df, 'tl', true)
        } else if(!r && !b && this.props.bitmap.getTile(x + 1, y + 1) !== 0) {
            polygon.corners.add(cx + df, cy + df, 'br', false)
        }
    }
}

class Corners {
    constructor(id) {
        this.id = id
        this.points = []
        this.pointsX = {}
        this.pointsY = {}
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
    
    negativeDirection(direction) {
        switch(direction) {
            case 'r': return 'l'
            case 'l': return 'r'
            case 't': return 'b'
            case 'b': return 't'
        }
    }
    
    leftFrom(p) {
        const points = this.pointsY[p.y]
        var idx = _.indexOf(points, p) - 1
        if(idx >= 0) {
            return points[idx]
        }
        if(p.acuteAngle) {
            return this.add(0, p.y, p.type.charAt(0) + 'r', true)
        } else {
            return this.add(0, p.y, this.negativeDirection(p.type.charAt(0)) + 'r', true)
        }
    }
    
    rightFrom(p) {
        const points = this.pointsY[p.y]
        var idx = _.indexOf(points, p) + 1
        if(idx < points.length) {
            return points[idx]
        }
        if(p.acuteAngle) {
            return this.add(sideInPixels, p.y, p.type.charAt(0) + 'l', true)
        } else {
            return this.add(sideInPixels, p.y, this.negativeDirection(p.type.charAt(0)) + 'l', true)
        }
    }
    
    topFrom(p) {
        const points = this.pointsX[p.x]
        var idx = _.indexOf(points, p) - 1
        if(idx >= 0) {
            return points[idx]
        }
        if(p.acuteAngle) {
            return this.add(p.x, 0, 'b' + p.type.charAt(1), true)
        } else {
            return this.add(p.x, 0, 'b' + this.negativeDirection(p.type.charAt(1)), true)
        }
    }
    
    bottomFrom(p) {
        const points = this.pointsX[p.x]
        var idx = _.indexOf(points, p) + 1
        if(idx < points.length) {
            return points[idx]
        }
        if(p.acuteAngle) {
            return this.add(p.x, sideInPixels, 't' + p.type.charAt(1), true)
        } else {
            return this.add(p.x, sideInPixels, 't' + this.negativeDirection(p.type.charAt(1)), true)
        }
    }
    
    markChunkEdges() {
        var edges = []
        _.forEach(this.pointsX, px => {
            var top = px[0]
            if(top.type.charAt(0) === 't') {
                edges.push(this.topFrom(top))
            }
            var bottom = px[px.length - 1]
            if(bottom.type.charAt(0) === 'b') {
                edges.push(this.bottomFrom(bottom))
            }
        })
        _.forEach(this.pointsY, py => {
            var left = py[0]
            if(left.type.charAt(1) === 'l') {
                edges.push(this.leftFrom(left))
            }
            var right = py[py.length - 1]
            if(right.type.charAt(1) === 'r') {
                edges.push(this.rightFrom(right))
            }
        })
        
    }
    
    debugCorners() {
        return _.map(this.points, x => x.drawCorner())
    }
    
}

