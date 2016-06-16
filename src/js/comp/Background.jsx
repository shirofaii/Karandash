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
        chunks: React.PropTypes.object.isRequired
    },
    
    shouldComponentUpdate: function(nextProps) {
        return this.props.chunk !== nextProps.chunk
    },
    
    chunks: function() {
        const bitmap = new Bitmap(this.props.chunks);
        return this.props.chunks.map((chunk, code) => {
            var p = Bitmap.decodeXY(code)
            return <Chunk x={p.x} y={p.y} chunk={chunk} bitmap={bitmap} key={code} />
        }).toArray()
    },
    
    render: function() {
        return <g>{this.chunks()}</g>
    }
});

module.exports = Background;
