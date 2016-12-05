var React = require('react');
var Redux = require('react-redux')
var imm = require('immutable')

var Chunk = require('./Chunk.jsx')
var ChunkedBitmap = require('../chunk.js')
var _ = require('lodash')
var Cursor = require('./Cursor.jsx')
var Background = require('./Background.jsx')
import {sideInTiles, tileInPixels, sideInPixels} from '../const.js'

var MapCanvas = React.createClass({
    propTypes: {
        canvas: React.PropTypes.instanceOf(imm.Record).isRequired,  // see canvas.js
        camera: React.PropTypes.instanceOf(imm.Record).isRequired,   // see camera.js
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

    clipBy: function() {
        return {
            x1: this.props.camera.get('x') - Math.floor(this.props.width * 0.5),
            y1: this.props.camera.get('y') - Math.floor(this.props.height * 0.5),
            x2: this.props.camera.get('x') + Math.floor(this.props.width * 0.5),
            y2: this.props.camera.get('y') + Math.floor(this.props.height * 0.5)
        }
    },

    // all events handled by Cursor component
    onMouseDown: function(e) {this.refs.cursor.onMouseDown(e)},
    render: function() {
        var bitmap = new ChunkedBitmap().on(this.props.canvas)
        return <svg
                className='canvas'
                viewBox={this.viewBox()}
                width={this.props.width}
                height={this.props.height}
                onMouseDown={this.onMouseDown}
                >
            <defs>
                <pattern id="gridPattern" width={tileInPixels} height={tileInPixels} patternUnits="userSpaceOnUse">
                    <path d={"M0,0 L0,"+tileInPixels+" L"+tileInPixels+","+tileInPixels} stroke="gray" strokeOpacity="0.5" strokeWidth="1" fill="none" />
                </pattern>
                <pattern id="wallPattern" width="4" height="4" patternUnits="userSpaceOnUse">
                    <rect x="0" y="0" width="4" height="4" fill='#eaeaea'/>
                </pattern>
            </defs>
            <Background bitmap={bitmap} clipBy={this.clipBy()} />
            <Cursor ref='cursor' dispatch={this.props.dispatch} height={this.props.height} width={this.props.width} camera={this.props.camera} bitmap={bitmap} />
        </svg>
    }
});

//
//                     <path d="M0,0L4,4M3,-1L5,1M-1,3L1,5" stroke='gray' strokeWidth='1'/>



module.exports = Redux.connect()(MapCanvas);
