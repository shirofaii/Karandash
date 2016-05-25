var imm = require('immutable');

var Camera = imm.Record({
    x: 0,
    y: 0,
    zoom: 1.0
})

function reducer(state = new Camera(), action) {
    switch (action.type) {
        case 'MOVE_CAMERA':
            return state.merge({
                x: state.x + action.dx,
                y: state.y + action.dy
            })
        case 'ZOOM':
            return state.merge({
                zoom: action.zoom
            })

        default:
            return state;
    }
}

function moveCamera(dx, dy) {
    return {
        type: 'MOVE_CAMERA',
        dx, dy
    }
}

function zoom(zoom) {
    return {
        type: 'ZOOM',
        zoom
    }
}


module.exports = {reducer, action: {moveCamera, zoom}}