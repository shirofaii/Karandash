var React = require('react');
var ReactDOM = require('react-dom');
var Redux = require('react-redux');
var ChunkedBitmap = require('../chunk.js')
var Chunk = require('./Chunk.jsx')
import {sideInTiles, tileInPixels, sideInPixels} from '../const.js'

/*
    Wall/space layer
*/

var Background = React.createClass({
    propTypes: {
        bitmap: React.PropTypes.instanceOf(ChunkedBitmap).isRequired,
        clipBy: React.PropTypes.object.isRequired // {x1: 0, y1: 0, x2: 10, y2: 10}
    },
    
    shouldComponentUpdate: function(nextProps) {
        return  this.props.bitmap.state !== nextProps.bitmap.state || 
                this.props.clipBy.x1 !== nextProps.clipBy.x1 ||
                this.props.clipBy.y1 !== nextProps.clipBy.y1
    },
    
    chunks: function() {
        var result = []
        for(var x = this.props.clipBy.x1; x <= this.props.clipBy.x2 + sideInPixels; x += sideInPixels) {
            for(var y = this.props.clipBy.y1; y <= this.props.clipBy.y2 + sideInPixels; y += sideInPixels) {
                var p = ChunkedBitmap.getChunkCoordsForPoint(x, y)
                result.push(<Chunk x={p.x} y={p.y} bitmap={this.props.bitmap} key={p.x + ',' + p.y} />)
            }
        }
        return result
    },
    
    render: function() {
        return <g>{this.chunks()}</g>
    }
});

module.exports = Background;
