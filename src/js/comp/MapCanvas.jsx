var React = require('react');
var Redux = require('react-redux');
//var px = require('react-pixi')
var Chunk = require('./Chunk.jsx')
var Bitmap = require('../chunk.js')
var _ = require('lodash')
var Cursor = require('./Cursor.jsx')
var Background = require('./Background.jsx')
import {sideInTiles, tileInPixels, sideInPixels} from '../const.js'

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
    
    // mouse down happens only on canvas, but
    // mouse up, move and keyboard events can be everywhere
    // all canvas related events handled by Cursor component
    onMouseDown: function(e) {this.refs.cursor.onMouseDown(e)},
    render: function() {
        return <svg
                className='canvas'
                viewBox={this.viewBox()}
                width={this.props.width}
                height={this.props.height}
                onMouseDown={this.onMouseDown}
                >
            <defs>
                <pattern id="gridPattern" width={tileInPixels} height={tileInPixels} patternUnits="userSpaceOnUse">
                        <path d={"M0,0 L0,"+tileInPixels+" L"+tileInPixels+","+tileInPixels} stroke="gray" strokeWidth="1" fill="none" />
                </pattern>
                <pattern id="wallPattern" width="12" height="12 " patternUnits="userSpaceOnUse">
                    <path d="M0,12L12,0" stroke='black' stroke-width='1' />
                </pattern>
            </defs>
            <Background chunks={this.props.canvas.chunks} defaultBackgroundTile={this.props.canvas.defaultBackgroundTile} />
            <Cursor ref='cursor' dispatch={this.props.dispatch} height={this.props.height} width={this.props.width} camera={this.props.camera} />
        </svg>
    }
});

module.exports = Redux.connect()(MapCanvas);
