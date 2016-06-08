var React = require('react');
var Redux = require('react-redux');

var camera = require('../action/camera.js')
var canvas = require('../action/canvas.js')

import {sideInTiles, tileInPixels, sideInPixels} from '../const.js'

/*
    Component handle all input related to MapCanvas, responsible for:
    * working with window-wide event listeners (because canvas has no focus)
    * have its own state
    * emit redux actions
    * change cursor appearance
*/

var Cursor = React.createClass({
    onMouseDown: function(e) {
        this.mouseX = e.clientX
        this.mouseY = e.clientY
        if(this.spacePressed) {
            this.startMoving()
        } else {
            this.startDrawing()
        }
    },
    onMouseUp: function(e) {
        this.stopDrawing()
        this.stopMoving()
        this.mouseX = null
        this.mouseY = null
    },
    onMouseEnter: function(e) {},
    onMouseLeave: function(e) { this.reset() },
    onBlur: function(e) { this.reset() },
    onMouseMove: function(e) {
        this.moving(e)
        this.drawing(e)
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
            this.stopMoving()
        }
    },
    
    startMoving: function() {
        this.isMoving = true
    },
    moving: function(e) {
        if(this.isMoving) {
            var dx = this.mouseX - e.clientX
            var dy = this.mouseY - e.clientY
            this.props.dispatch(camera.action.moveCamera(dx, dy))
        }
    },
    stopMoving: function() {
        if(!this.isMoving) return
        
        this.isMoving = false
    },
    
    startDrawing: function() {
        this.isDrawing = true
        this.props.dispatch(canvas.action.setPen(1))
        var p = this.mouseToTile({x: this.mouseX, y: this.mouseY})
        this.props.dispatch(canvas.action.drawBegin(p.x, p.y))
    },
    drawing: function(e) {
        if(this.isDrawing) {
            var f = this.mouseToTile({x: this.mouseX, y: this.mouseY})
            var t = this.mouseToTile({x: e.clientX, y: e.clientY})
            this.props.dispatch(canvas.action.lineTo(f.x, f.y, t.x, t.y))
        }
    },
    stopDrawing: function() {
        if(!this.isDrawing) return
        
        this.props.dispatch(canvas.action.drawEnd())
        this.isDrawing = false
    },
    
    mouseToTile: function(m) {
        m.x = Math.floor((this.props.camera.x - this.props.width / 2 + m.x) / tileInPixels)
        m.y = Math.floor((this.props.camera.y - this.props.height / 2 + m.y) / tileInPixels)
        return m
    },
    
    reset: function() {
        this.mouseX = null
        this.mouseY = null
        this.spacePressed = false
        this.stopMoving()
        this.stopDrawing()
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
        return null
    }
});

module.exports = Cursor;
