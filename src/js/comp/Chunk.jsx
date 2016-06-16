var React = require('react');
var Redux = require('react-redux');
import {sideInTiles, tileInPixels, sideInPixels} from '../const.js'

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
            this.drawGrid(x, y, e)
            switch(e) {
                case 0: result.push(this.drawFloor(x, y, i)); break;
                case 1: result.push(this.drawWall(x, y, i)); break;
                default: throw 'wrong tile';
            }
        }
        return result
    },
    
    drawGrid: function(x, y, e) {
        
    },
    
    render: function() {
        return <svg x={this.props.x * sideInPixels} y={this.props.y * sideInPixels} width={sideInPixels} height={sideInPixels}>
            {this.drawChunk()}
            <rect x="0" y="0" width={sideInPixels} height={sideInPixels} fill="url(#gridPattern)" />
        </svg>
    }
});

module.exports = Chunk;
