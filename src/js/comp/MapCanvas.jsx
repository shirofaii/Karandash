var React = require('react');
var Redux = require('react-redux');
//var px = require('react-pixi')
var Chunk = require('./Chunk.jsx')
var _ = require('lodash')

var MapCanvas = React.createClass({
    propTypes: {
        canvas: React.PropTypes.object.isRequired,
        camera: React.PropTypes.object.isRequired,
        width: React.PropTypes.number.isRequired,
        height: React.PropTypes.number.isRequired
    },
    
    chunks: function() {
        return this.props.canvas.chunks.map((bitmap, code) => {
            var x = (code >> 15) - 16383
            var y = (code & 0x7fff) - 16383
            
            return <Chunk x={x} y={y} bitmap={bitmap} key={code} />
        }).toArray()
    },
    
    viewBox: function() {
        return _.join([
            this.props.camera.get('x') - Math.floor(this.props.width * 0.5),
            this.props.camera.get('y') - Math.floor(this.props.height * 0.5),
            this.props.width,
            this.props.height
        ], ' ')
    },
    
    render: function() {
        return <svg className='canvas' ref='canvas' viewBox={this.viewBox()} width={this.props.width} height={this.props.height}>
            {this.chunks()}
        </svg>
    }
});

module.exports = MapCanvas;
