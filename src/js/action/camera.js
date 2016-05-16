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
                y: state.y + action.dy,
                z: state.z + action.dz
            })
        default:
            return state;
    }
}

function moveCamera(dx, dy, dz) {
    return dispatch => {dispatch({
        type: 'MOVE_CAMERA',
        dx, dy, dz
    })}
}


module.exports = {reducer, action: {moveCamera}}