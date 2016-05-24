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
    
    getInitialState: function() {
        return {
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight
        };
    },
    
    handleResize: function(e) {
        this.setState({
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight
        });
    },
    
    componentDidMount: function() {
        window.addEventListener('resize', this.handleResize);
    },
    
    componentWillUnmount: function() {
        window.removeEventListener('resize', this.handleResize);
    },
    
    render: function() {
        return <div>
            <h1>{this.props.title}</h1>
            <MapCanvas canvas={this.props.canvas} camera={this.props.camera} width={this.state.windowWidth} height={this.state.windowHeight} />
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
