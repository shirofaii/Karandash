var React = require('react');
var ReactDOM = require('react-dom');
var Redux = require('react-redux');
var Bitmap = require('../chunk.js')
var Chunk = require('./Chunk.jsx')
import immutableRenderMixin from 'react-immutable-render-mixin';
import {sideInTiles, tileInPixels, sideInPixels} from '../const.js'

/*
    Prepare all data required for a rendering
*/

var Background = React.createClass({
    propTypes: {
        chunks: React.PropTypes.object.isRequired
    },
    mixins: [immutableRenderMixin],
    
    chunks: function() {
        return this.props.chunks.map((chunk, code) => {
            var p = Bitmap.decodeXY(code)
            return <Chunk x={p.x} y={p.y} bitmap={chunk.background} nbitmap={chunk.nbitmap} key={code} />
        }).toArray()
    },
    
    render: function() {
        return <g>{this.chunks()}</g>
    }
});

module.exports = Background;
