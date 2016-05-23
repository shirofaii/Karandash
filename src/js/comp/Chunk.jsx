var React = require('react');
var Redux = require('react-redux');
var px = require('react-pixi')


var Chunk = React.createClass({
    propTypes: {
        x: React.PropTypes.number.isRequired,
        y: React.PropTypes.number.isRequired,
        bitmap: React.PropTypes.object.isRequired
    },
    
    render: function() {
        return <px.DisplayObjectContainer x={this.props.x * sideInPixels} y={this.props.y * sideInPixels}>
            
        </px.DisplayObjectContainer>
    }
});

module.exports = Chunk;
