var imm = require('immutable');
var Bitmap = require('../chunk.js')

var Canvas = imm.Record({
    pen: null,
    penPosition: null,
    isDrawing: false,
    defaultBackgroundTile: 0,
    chunks: imm.Map()
})

var bitmap = new Bitmap()

function reducer(state = new Canvas(), action) {
    switch (action.type) {
        case 'SET_PEN':
            return state.merge({
                pen: action.tile
            })
        case 'DRAW_BEGIN':
            bitmap.on(state).setTile(action.x, action.y, state.get('pen'))
            return state.merge({
                isDrawing: true,
                penPosition: {x: action.x, y: action.y},
                chunks: bitmap.state
            })
        case 'LINE_TO':
            bitmap.on(state).line(state.get('penPosition').get('x'), state.get('penPosition').get('y'), action.x, action.y, state.get('pen'))
            return state.merge({
                chunks: bitmap.state,
                penPosition: {x: action.x, y: action.y}
            })
        case 'DRAW_END':
            return state.merge({
                isDrawing: false,
                penPosition: null
            })
        default:
            return state;
    }
}

function setPen(tile) {
    return {
        type: 'SET_PEN',
        tile
    }
}

function drawBegin(x, y) {
    return {
        type: 'DRAW_BEGIN',
        x, y
    }
}

function lineTo(x, y) {
    return {
        type: 'LINE_TO',
        x, y
    }
}

function drawEnd() {
    return {
        type: 'DRAW_END'
    }
}


module.exports = {reducer, action: {setPen, drawBegin, lineTo, drawEnd}}