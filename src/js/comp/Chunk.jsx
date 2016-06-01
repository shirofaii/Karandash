var React = require('react');
var ReactDOM = require('react-dom');
var PureRenderMixin = require('react-addons-pure-render-mixin');
var Redux = require('react-redux');
import {sideInTiles, tileInPixels, sideInPixels} from '../const.js'


var Chunk = React.createClass({
    propTypes: {
        x: React.PropTypes.number.isRequired,
        y: React.PropTypes.number.isRequired,
        bitmap: React.PropTypes.object.isRequired
    },
    mixins: [PureRenderMixin],
    
    componentDidMount: function() {
        this.drawBitmap()
    },
    
    componentDidUpdate: function(prevProps) {
        this.drawBitmap()
    },
    
    // x, y cords in chunk space
    drawWall: function(x, y, ctx) {
        ctx.fillStyle = 'black'
        ctx.fillRect(x * tileInPixels, y * tileInPixels, tileInPixels, tileInPixels)
    },
    drawFloor: function(x, y, ctx) {
        ctx.fillStyle = 'gray'
        ctx.fillRect(x * tileInPixels, y * tileInPixels, tileInPixels, tileInPixels)
    },
    
    drawBitmap: function() {
        var canvas = ReactDOM.findDOMNode(this.refs.canvas)
        var ctx = canvas.getContext('2d')
        for(var i = 0; i < sideInTiles*sideInTiles; i++) {
            var e = this.props.bitmap[i]
            var x = i % sideInTiles
            var y = Math.trunc(i / sideInTiles)
            switch(e) {
                case 0: this.drawFloor(x, y, ctx); break;
                case 1: this.drawWall(x, y, ctx); break;
                default: throw 'wrong tile';
            }
        }
    },
    
    render: function() {
        return <foreignObject x={this.props.x * sideInPixels} y={this.props.y * sideInPixels} width={sideInPixels} height={sideInPixels}>
            <canvas ref='canvas' width={sideInPixels} height={sideInPixels} />
        </foreignObject>
    }
});

module.exports = Chunk;
