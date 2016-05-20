var React = require('react');
var Redux = require('react-redux');
var px = require('react-pixi')
var Chunk = require('./Chunk.jsx')

var MapCanvas = React.createClass({
    propTypes: {
        canvas: React.PropTypes.object.isRequired,
        camera: React.PropTypes.object.isRequired
    },
    
    chunks: function() {
        return this.props.canvas.chunks.map((c, p) => <Chunk x={p.x} y={p.y} bitmap={c} />)
    },
    
    render: function() {
        return <px.Stage width={800} height={800} >
            {this.chunks()}
        </px.Stage>
    }
});

module.exports = MapCanvas;
