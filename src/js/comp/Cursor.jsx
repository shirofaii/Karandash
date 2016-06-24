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
    // delegated from MapCanvas component
    onMouseDown: function(e) {
        this.mouseX = e.clientX
        this.mouseY = e.clientY
        this.startCapture()
        if(e.button === 1) {
            this.startMoving()
        } else {
            this.startDrawing()
        }
    },
    onMouseUp: function(e) {
        this.releaseCapture()
        this.stopDrawing()
        this.stopMoving()
        this.mouseX = null
        this.mouseY = null
    },
    onMouseMove: function(e) {
        this.moving(e)
        this.drawing(e)
        this.mouseX = e.clientX
        this.mouseY = e.clientY
    },
    onKeyDown: function(e) {
    },
    onKeyUp: function(e) {
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
    
    startCapture: function() {
        window.addEventListener('mouseup', this.onMouseUp);
        window.addEventListener('mousemove', this.onMouseMove);
    },
    releaseCapture: function() {
        window.removeEventListener('mouseup', this.onMouseUp);
        window.removeEventListener('mousemove', this.onMouseMove);
    },
    
    componentDidMount: function() {
        document.addEventListener('keydown', this.onKeyDown);
        document.addEventListener('keyup', this.onKeyUp);
    },
    
    componentWillUnmount: function() {
        document.removeEventListener('keydown', this.onKeyDown);
        document.removeEventListener('keyup', this.onKeyUp);
    },
    
    render: function() {
        return null
    }
});

module.exports = Cursor;
