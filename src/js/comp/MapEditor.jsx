var React = require('react');
var Redux = require('react-redux');

var MapCanvas = require('./MapCanvas.jsx')

var MapEditor = React.createClass({
    propTypes: {
        title: React.PropTypes.string.isRequired,
        isLoading: React.PropTypes.bool.isRequired,
        isSaving: React.PropTypes.bool.isRequired,
        url: React.PropTypes.string.isRequired,
        errors: React.PropTypes.object.isRequired, // imm.List(string)
        canvas: React.PropTypes.object.isRequired,
        camera: React.PropTypes.object.isRequired
    },
    
    render: function() {
        return <div>
            <h1>{this.props.title}</h1>
            <MapCanvas canvas={this.props.canvas} camera={this.props.camera} />
        </div>
    }
});

function mapStateToProps(state) {
    return {
        title: state.info.title,
        isLoading: state.info.isLoading,
        isSaving: state.info.isSaving,
        url: state.info.url,
        errors: state.info.errors,
        canvas: state.canvas,
        camera: state.camera
    }
}

module.exports = Redux.connect(mapStateToProps)(MapEditor);
