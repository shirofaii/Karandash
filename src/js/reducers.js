var redux = require('redux')

var info = require('./action/info.js').reducer
var canvas = require('./action/canvas.js').reducer
var camera = require('./action/camera.js').reducer

const rootReducer = redux.combineReducers({
    info,
    canvas,
    camera
});

module.exports = rootReducer;
