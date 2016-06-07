var React = require('react');
var Redux = require('react-redux');
//var px = require('react-pixi')
var Chunk = require('./Chunk.jsx')
var Bitmap = require('../chunk.js')
var _ = require('lodash')
var Cursor = require('./Cursor.jsx')

var MapCanvas = React.createClass({
    propTypes: {
        canvas: React.PropTypes.object.isRequired,
        camera: React.PropTypes.object.isRequired,
        width: React.PropTypes.number.isRequired,
        height: React.PropTypes.number.isRequired
    },
    
    
    viewBox: function() {
        return _.join([
            this.props.camera.get('x') - Math.floor(this.props.width * 0.5),
            this.props.camera.get('y') - Math.floor(this.props.height * 0.5),
            this.props.width,
            this.props.height
        ], ' ')
    },
    
    // delegate all input to Cursor
    onMouseDown: function(e) {this.refs.cursor.onMouseDown(e)},
    onMouseUp: function(e) {this.refs.cursor.onMouseUp(e)},
    onMouseEnter: function(e) {this.refs.cursor.onMouseEnter(e)},
    onMouseLeave: function(e) {this.refs.cursor.onMouseLeave(e)},
    onMouseMove: function(e) {this.refs.cursor.onMouseMove(e)},
    
    render: function() {
        return <svg
                className='canvas'
                viewBox={this.viewBox()}
                width={this.props.width}
                height={this.props.height}
                onMouseDown={this.onMouseDown}
                onMouseUp={this.onMouseUp}
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
                onMouseMove={this.onMouseMove}
                >
            <Cursor ref='cursor' dispatch={this.props.dispatch} height={this.props.height} width={this.props.width} camera={this.props.camera} />
            <Background chunks={this.props.canvas.chunks}/>
        </svg>
    }
});

module.exports = Redux.connect()(MapCanvas);
