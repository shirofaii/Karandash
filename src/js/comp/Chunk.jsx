var React = require('react');
var Redux = require('react-redux');
var _ = require('lodash');
import {sideInTiles, tileInPixels, sideInPixels} from '../const.js'

class Point {
    // coords chunk based, pixels
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
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
    
    drawCircle() {
        return <path d={this.path()} fill='none' stroke='red' stroke-width='2' key={this.x + ':' + this.y} />
    }
}

class Grid {
    constructor() {
        this.points = []
        this.pointsX = {}
        this.pointsY = {}
    }
    
    add(x, y, type) {
        var p = new Point(x, y, type)
        var a
        this.points.push(p)
        
        if(!this.pointsX[x]) {this.pointsX[x] = []}
        a = this.pointsX[x]
        a.splice(_.sortedIndexBy(a, p, 'y'), 0, p);
        
        if(!this.pointsY[y]) {this.pointsY[y] = []}
        a = this.pointsY[y]
        a.splice(_.sortedIndexBy(a, p, 'x'), 0, p);
        
        return p
    }
    
    leftFrom(p) {
        const points = this.pointsY[p.y]
        var idx = _.indexOf(points, p) - 1
        if(idx >= 0) {
            return points[idx]
        }
        return this.add(0, p.y, p.type.charAt(0) + 'r')
    }
    
    rightFrom(p) {
        const points = this.pointsY[p.y]
        var idx = _.indexOf(points, p) + 1
        if(idx < points.length) {
            return points[idx]
        }
        return this.add(sideInPixels, p.y, p.type.charAt(0) + 'l')
    }
    
    topFrom(p) {
        const points = this.pointsX[p.x]
        var idx = _.indexOf(points, p) - 1
        if(idx >= 0) {
            return points[idx]
        }
        return this.add(p.x, 0, 'b' + p.type.charAt(1))
    }
    
    bottomFrom(p) {
        const points = this.pointsX[p.x]
        var idx = _.indexOf(points, p) + 1
        if(idx < points.length) {
            return points[idx]
        }
        return this.add(p.x, sideInPixels, 't' + p.type.charAt(1))
    }
    
    debugPoints() {
        return _.map(this.points, x => x.drawCircle())
    }
}

var Chunk = React.createClass({
    propTypes: {
        x: React.PropTypes.number.isRequired,
        y: React.PropTypes.number.isRequired,
        chunk: React.PropTypes.object.isRequired,
        bitmap: React.PropTypes.object.isRequired
    },
    
    shouldComponentUpdate: function(nextProps) {
        return this.props.chunk !== nextProps.chunk
    },
    
    // x, y cords in chunk space
    drawWall: function(x, y, i) {
        var style = {
            fill: 'rgb(0, 0, 0)'
        }
        return <rect x={x * tileInPixels} y={y * tileInPixels} width={tileInPixels} height={tileInPixels} style={style} key={i} />
    },
    drawFloor: function(x, y, i) {
        var style = {
            fill: 'rgb(200, 200, 200)'
        }
        return <rect x={x * tileInPixels} y={y * tileInPixels} width={tileInPixels} height={tileInPixels} style={style} key={i} />
    },
    
    drawChunk: function() {
        var result = []
        for(var i = 0; i < sideInTiles*sideInTiles; i++) {
            var e = this.props.chunk[i]
            var x = i % sideInTiles
            var y = Math.trunc(i / sideInTiles)
            switch(e) {
                case 0: result.push(this.drawWall(x, y, i)); break;
                case 1: result.push(this.drawFloor(x, y, i)); break;
                default: throw 'wrong tile';
            }
        }
        return result
    },
    
    drawGrid: function() {
        var grid = new Grid()
        const sx = this.props.x * sideInTiles
        const sy = this.props.y * sideInTiles
        const df = 10
        for(var x = sx; x < sx + sideInTiles; x++) {
            for(var y = sy; y < sy + sideInTiles; y++) {
                const e = this.props.bitmap.getTile(x, y)
                if(e !== 0) continue;
                
                const cx = (x - sx) * tileInPixels + tileInPixels / 2
                const cy = (y - sy) * tileInPixels + tileInPixels / 2
                
                const r = this.props.bitmap.getTile(x + 1, y) !== 0
                const b = this.props.bitmap.getTile(x, y + 1) !== 0
                const l = this.props.bitmap.getTile(x - 1, y) !== 0
                const t = this.props.bitmap.getTile(x, y - 1) !== 0
                
                if(t && l) {
                    grid.add(cx - df, cy - df, 'br')
                } else if(!t && !l && this.props.bitmap.getTile(x - 1, y - 1) !== 0) {
                    grid.add(cx - df, cy - df, 'tl')
                }
                
                if(t && r) {
                    grid.add(cx + df, cy - df, 'bl')
                } else if(!t && !r && this.props.bitmap.getTile(x + 1, y - 1) !== 0) {
                    grid.add(cx + df, cy - df, 'tr')
                }
                
                if(b && l) {
                    grid.add(cx - df, cy + df, 'tr')
                } else if(!b && !l && this.props.bitmap.getTile(x - 1, y + 1) !== 0) {
                    grid.add(cx - df, cy + df, 'bl')
                }
                
                if(r && b) {
                    grid.add(cx + df, cy + df, 'tl')
                } else if(!r && !b && this.props.bitmap.getTile(x + 1, y + 1) !== 0) {
                    grid.add(cx + df, cy + df, 'br')
                }
            }
        }
        var pts = _.filter(grid.points, p => p.type.charAt(0) === 'b')
        var paths = _.map(pts, p => this.drawLine(p, grid.bottomFrom(p)))
        
        return <g>
            {paths}
            {grid.debugPoints()}
        </g>
    },
    
    drawLine: function(f, t) {
        var d = 'M' + f.x + ',' + f.y
        d += 'L' + t.x + ',' + t.y
        return <path d={d} fill='none' stroke='yellow' stroke-width='1' key={f.x + ':' + f.y} />
    },
    
    render: function() {
        return <svg x={this.props.x * sideInPixels} y={this.props.y * sideInPixels} width={sideInPixels} height={sideInPixels}>
            {this.drawChunk()}
            {this.drawGrid()}
            <rect x="0" y="0" width={sideInPixels} height={sideInPixels} fill="url(#gridPattern)" />
        </svg>
    }
});

module.exports = Chunk;
