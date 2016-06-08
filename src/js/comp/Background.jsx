var React = require('react');
var ReactDOM = require('react-dom');
var PureRenderMixin = require('react-addons-pure-render-mixin');
var Redux = require('react-redux');
var Bitmap = require('../chunk.js')
var Chunk = require('./Chunk.jsx')
import {sideInTiles, tileInPixels, sideInPixels} from '../const.js'

/*
    Prepare all data required for a beautiful rendering
    nbitmap contains compilation of all neighbours for each tile, its simplifies visual rendering
    format uint8, each bit represent neighbour side from top on clockwise  [t tr r rb b bl l lt]
*/

var Background = React.createClass({
    propTypes: {
        chunks: React.PropTypes.object.isRequired
    },
    mixins: [PureRenderMixin],
    
    chunks: function() {
        return this.props.chunks.map((bitmap, code) => {
            var p = Bitmap.decodeXY(code)
            return <Chunk x={p.x} y={p.y} bitmap={bitmap} nbitmap={bitmap} key={code} />
        }).toArray()
    },

    componentDidMount: function() {
        this.drawBitmap()
    },
    
    componentDidUpdate: function(prevProps) {
        this.drawBitmap()
    },
    
    drawBitmap: function() {
        // for(var i = 0; i < sideInTiles*sideInTiles; i++) {
        //     var e = this.props.bitmap[i]
        // }
    },
    
    render: function() {
        return <g>{this.chunks()}</g>
    }
});

module.exports = Background;
