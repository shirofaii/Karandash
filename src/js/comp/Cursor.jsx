var React = require('react');
var Redux = require('react-redux');
var imm = require('immutable')

var camera = require('../action/camera.js')
var canvas = require('../action/canvas.js')

var ChunkedBitmap = require('../chunk.js')

import {sideInTiles, tileInPixels, sideInPixels} from '../const.js'

/*
    Component handle all input related to MapCanvas, responsible for:
    * working with window-wide event listeners (because canvas has no focus)
    * have its own state
    * emit redux actions
    * change cursor appearance
*/

/*
    idle:
        predraw cursor (wall/space)
    camera move (middle button pressed):
        move camera
    drawing (first button pressed):
        drawing cursor (wall/space tile)
    drawing (first button and shift pressed):
        drawing cursor (wall/space rect)

    placing cursor (object)
    erasing cursor (tile/rect)
*/

var Cursor = React.createClass({
    propTypes: {
        height: React.PropTypes.number.isRequired,
        width: React.PropTypes.number.isRequired,
        bitmap: React.PropTypes.instanceOf(ChunkedBitmap).isRequired,
        camera: React.PropTypes.instanceOf(imm.Record).isRequired,   // see camera.js
        dispatch: React.PropTypes.func.isRequired
    },

    // delegated from MapCanvas component
    onMouseDown: function(e) {
        this.mouseX = e.clientX
        this.mouseY = e.clientY
        if(e.button === 1) {
            this.startMoving()
        } else {
            this.startDrawing()
        }
        this.forceUpdate()
    },
    onMouseUp: function(e) {
        this.stopDrawing()
        this.stopMoving()
        this.forceUpdate()
    },
    onMouseMove: function(e) {
        this.moving(e)
        this.drawing(e)
        this.mouseX = e.clientX
        this.mouseY = e.clientY
        this.forceUpdate()
    },
    onKeyDown: function(e) {
    },
    onKeyUp: function(e) {
    },

    mouseToTile: function(m) {
        m.x = Math.floor((this.props.camera.x - this.props.width / 2 + m.x) / tileInPixels)
        m.y = Math.floor((this.props.camera.y - this.props.height / 2 + m.y) / tileInPixels)
        return m
    },

    mousePosition: function() {
        return {x: this.mouseX, y: this.mouseY}
    },

    getTile: function(x, y) {
        return this.props.bitmap.getTile(x, y)
    },

    componentDidMount: function() {
        document.addEventListener('keydown', this.onKeyDown);
        document.addEventListener('keyup', this.onKeyUp);
        window.addEventListener('mouseup', this.onMouseUp);
        window.addEventListener('mousemove', this.onMouseMove);
    },

    componentWillUnmount: function() {
        document.removeEventListener('keydown', this.onKeyDown);
        document.removeEventListener('keyup', this.onKeyUp);
        window.removeEventListener('mouseup', this.onMouseUp);
        window.removeEventListener('mousemove', this.onMouseMove);
    },

    renderDrawing: function() {
        if(this.mouseX === undefined) return null
        var tile = this.mouseToTile(this.mousePosition())
        return <rect x={tile.x * tileInPixels} y={tile.y * tileInPixels} width={tileInPixels} height={tileInPixels} fill='none' stroke='gray' />
    },

    render: function() {
        if(this.isMoving) return null
        return this.renderDrawing()
    },

    // camera moving
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

    // wall/space drawing
    startDrawing: function() {
        this.isDrawing = true
        var p = this.mouseToTile(this.mousePosition())
        this.drawingTile = this.getTile(p.x, p.y) === 1 ? 0 : 1
        this.props.dispatch(canvas.action.setPen(this.drawingTile))
        this.props.dispatch(canvas.action.drawBegin(p.x, p.y))
    },
    drawing: function(e) {
        if(this.isDrawing) {
            var f = this.mouseToTile(this.mousePosition())
            var t = this.mouseToTile({x: e.clientX, y: e.clientY})
            this.props.dispatch(canvas.action.lineTo(f.x, f.y, t.x, t.y))
        }
    },
    stopDrawing: function() {
        if(!this.isDrawing) return

        this.props.dispatch(canvas.action.drawEnd())
        this.isDrawing = false
        this.drawingTile = null
    },

});

module.exports = Cursor;
