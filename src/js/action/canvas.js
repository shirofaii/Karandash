var imm = require('immutable');

var Canvas = imm.Record({
    pen: null,
    penPosition: null,
    isDrawing: false,
    
    chunks: imm.Map()
})

function reducer(state = new Canvas(), action) {
    switch (action.type) {
        case 'SET_PEN':
            return state.merge({
                pen: action.tile
            })
        case 'DRAW_BEGIN':
            return state.merge({
                isDrawing: true,
                penPosition: {x: action.x, y: action.y}
            })
        case 'LINE_TO':
            return state.merge({
                
            })
        case 'RECT_TO':
            return state.merge({
                
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
    return dispatch => {dispatch({
        type: 'SET_PEN',
        tile
    })}
}

function drawBegin(x, y) {
    return dispatch => {dispatch({
        type: 'DRAW_BEGIN',
        x, y
    })}
}

function lineTo(x, y) {
    return dispatch => {dispatch({
        type: 'LINE_TO',
        x, y
    })}
}

function rectTo(x, y) {
    return dispatch => {dispatch({
        type: 'RECT_TO',
        x, y
    })}
}

function drawEnd() {
    return dispatch => {dispatch({
        type: 'DRAW_END'
    })}
}


module.exports = {reducer, action: {setPen, drawBegin, lineTo, rectTo, drawEnd}}