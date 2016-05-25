var React = require('react');
var Redux = require('react-redux');
//var px = require('react-pixi')
var Chunk = require('./Chunk.jsx')
var Bitmap = require('../chunk.js')
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
            var p = Bitmap.decodeXY(code)
            return <Chunk x={p.x} y={p.y} bitmap={bitmap} key={code} />
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
