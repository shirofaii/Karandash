var React = require('react');
var Redux = require('react-redux');
var _ = require('lodash');
var ChunkedBitmap = require('../chunk.js')

import {sideInTiles, tileInPixels, sideInPixels} from '../const.js'
import {Plotter} from '../plotter.js'


var Chunk = React.createClass({
    propTypes: {
        x: React.PropTypes.number.isRequired,
        y: React.PropTypes.number.isRequired,
        bitmap: React.PropTypes.instanceOf(ChunkedBitmap).isRequired
    },
    
    shouldComponentUpdate: function(nextProps) {
        //TODO: think about optimize this
        return this.props.bitmap.state !== nextProps.bitmap.state
    },
    
    drawLines: function() {
        var plotter = new Plotter(this.props)
        return plotter.svg()
    },
    
    render: function() {
        return <svg x={this.props.x * sideInPixels} y={this.props.y * sideInPixels} width={sideInPixels} height={sideInPixels}>
            {this.drawLines()}
            <rect x="0" y="0" width={sideInPixels} height={sideInPixels} fill="url(#gridPattern)" />
        </svg>
    }
});

module.exports = Chunk;
