var imm = require('immutable');

var Toolbox = imm.Record({
    currentTool: 'tilePainter',
    tilePainter: imm.Record({
        tile: 'wall'
    }),
    shapePlacer: Record({
        type: 'tree',
        variant: 'g1,1'
    }),
    textEditor: imm.Record({
        font: 'Arial',
        size: 12,
        align: 'left'
    })
});

function reducer(state = new Toolbox(), action) {
    switch (action.type) {
        case 'SELECT_TOOL':
            return state.merge({
                currentTool: action.name
            })
        default:
            return state;
    }
}

function selectTool(name) {
    return dispatch => {dispatch({
        type: 'SELECT_TOOL',
        name
    })}
}

module.exports = {reducer, action: {selectTool}}