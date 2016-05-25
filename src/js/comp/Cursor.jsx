var React = require('react');
var Redux = require('react-redux');

var camera = require('../action/camera.js').action
var canvas = require('../action/canvas.js').action

/*
    Component handle all input related to MapCanvas, responsible for:
    * working with window-wide event listeners (because canvas have no focus)
    * have its own state
    * emit redux actions
    * change cursor appearance
*/

var Cursor = React.createClass({
    onMouseDown: function(e) {
        this.mouseX = e.clientX
        this.mouseY = e.clientY
        if(this.spacePressed) {
            this.setState({ isDragged: true })
        } else {
            
        }
    },
    onMouseUp: function(e) {
        this.mouseX = null
        this.mouseY = null
        this.setState({ isDragged: false })
    },
    onMouseEnter: function(e) {},
    onMouseLeave: function(e) {},
    onBlur: function(e) { this.reset() },
    onMouseMove: function(e) {
        if(this.state.isDragged) {
            var dx = this.mouseX - e.clientX
            var dy = this.mouseY - e.clientY
            this.props.dispatch(camera.moveCamera(dx, dy))
        }
        this.mouseX = e.clientX
        this.mouseY = e.clientY
        
    },
    onKeyDown: function(e) {
        if(e.code === 'Space') {
            this.spacePressed = true
        }
    },
    onKeyUp: function(e) {
        if(e.code === 'Space') {
            this.spacePressed = false
            this.setState({ isDragged: false })
        }
    },
    
    reset: function() {
        this.mouseX = null
        this.mouseY = null
        this.spacePressed = false
        this.setState(this.getInitialState())
    },
    
    getInitialState: function() {
        return {
            isDragged: false
        };
    },
    
    componentDidMount: function() {
        document.addEventListener('keydown', this.onKeyDown);
        document.addEventListener('keyup', this.onKeyUp);
        window.addEventListener('blur', this.onBlur);
    },
    
    componentWillUnmount: function() {
        document.removeEventListener('keydown', this.onKeyDown);
        document.removeEventListener('keyup', this.onKeyUp);
        window.removeEventListener('blur', this.onBlur);
    },
    
    render: function() {
        if(this.state.isDragged) {
            document.body.style.cursor = "move";
        } else {
            document.body.style.cursor = "default";
        }
        return null
    }
});

module.exports = Cursor;
