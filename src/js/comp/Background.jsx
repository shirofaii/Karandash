var React = require('react');
var ReactDOM = require('react-dom');
var Redux = require('react-redux');
var Bitmap = require('../chunk.js')
var Chunk = require('./Chunk.jsx')
import {sideInTiles, tileInPixels, sideInPixels} from '../const.js'

/*
    Prepare all data required for a rendering
*/

var Background = React.createClass({
    propTypes: {
        canvas: React.PropTypes.object.isRequired,
        clipBy: React.PropTypes.object.isRequired
    },
    
    shouldComponentUpdate: function(nextProps) {
        return  this.props.canvas.chunks !== nextProps.canvas.chunks || 
                this.props.clipBy.x1 !== nextProps.clipBy.x1 ||
                this.props.clipBy.y1 !== nextProps.clipBy.y1
    },
    
    chunks: function() {
        const bitmap = new Bitmap().on(this.props.canvas);
        var result = []
        for(var x = this.props.clipBy.x1; x <= this.props.clipBy.x2 + sideInPixels; x += sideInPixels) {
            for(var y = this.props.clipBy.y1; y <= this.props.clipBy.y2 + sideInPixels; y += sideInPixels) {
                var p = Bitmap.getChunkCoordsForPoint(x, y)
                result.push(<Chunk x={p.x} y={p.y} bitmap={bitmap} key={p.x + ',' + p.y} />)
            }
        }
        return result
    },
    
    render: function() {
        return <g>{this.chunks()}</g>
    }
});

module.exports = Background;
