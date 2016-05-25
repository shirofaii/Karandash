var React = require('react');
var PureRenderMixin = require('react-addons-pure-render-mixin');
var Redux = require('react-redux');
//var px = require('react-pixi')

const tiles = {
    wall: 0,
    floor: 1
}

const sideInTiles = 8
const tileInPixels = 32
const sideInPixels = sideInTiles * tileInPixels


var Chunk = React.createClass({
    propTypes: {
        x: React.PropTypes.number.isRequired,
        y: React.PropTypes.number.isRequired,
        bitmap: React.PropTypes.object.isRequired
    },
    mixins: [PureRenderMixin],
    
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
    
    drawBitmap: function() {
        var result = []
        for(var i = 0; i < sideInTiles*sideInTiles; i++) {
            var e = this.props.bitmap[i]
            var x = i % sideInTiles
            var y = Math.trunc(i / sideInTiles)
            switch(e) {
                case 0: result.push(this.drawFloor(x, y, i)); break;
                case 1: result.push(this.drawWall(x, y, i)); break;
                default: throw 'wrong tile';
            }
        }
        return result
    },
    
    render: function() {
        return <svg x={this.props.x * sideInPixels} y={this.props.y * sideInPixels} width={sideInPixels} height={sideInPixels}>
            {this.drawBitmap()}
        </svg>
    }
});

module.exports = Chunk;
