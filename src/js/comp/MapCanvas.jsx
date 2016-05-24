var React = require('react');
var Redux = require('react-redux');
//var px = require('react-pixi')
var Chunk = require('./Chunk.jsx')

var MapCanvas = React.createClass({
    propTypes: {
        canvas: React.PropTypes.object.isRequired,
        camera: React.PropTypes.object.isRequired
    },
    
    chunks: function() {
        return this.props.canvas.chunks.map((bitmap, code) => {
            var x = (code >> 15) - 16383
            var y = (code & 0x7fff) - 16383
            return <Chunk x={x} y={y} bitmap={bitmap} key={code} />
        }).toArray()
    },
    
    render: function() {
        return <div>
            {this.chunks()}
        </div>
    }
});

module.exports = MapCanvas;
