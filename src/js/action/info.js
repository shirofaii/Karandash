var imm = require('immutable');

var Info = imm.Record({
    title: '',
    url: '',
    isLoading: false,
    isSaving: false,
    errors: imm.List()
});

function reducer(state = new Info(), action) {
    switch (action.type) {
        case 'LOAD_MAP':
            return state.merge({
                url: action.url,
                isLoading: true
            })
        case 'SAVE_MAP':
            return state.merge({
                isSaving: true
            })
        case 'SHOW_ERROR':
            return state.merge({
                errors: state.errors.push(action.error)
            })
        case 'HIDE_ERROR':
            return state.merge({
                errors: state.errors.shift()
            })
        default:
            return state;
    }
}

function loadMap(url) {
    return dispatch => {dispatch({
        type: 'LOAD_MAP',
        url
    })}
}

function saveMap() {
    return dispatch => {dispatch({
        type: 'SAVE_MAP'
    })}
}

function showError(error) {
    return dispatch => {dispatch({
        type: 'SHOW_ERROR',
        error
    })}
}

function hideError() {
    return dispatch => {dispatch({
        type: 'HIDE_ERROR'
    })}
}

module.exports = {reducer, action: {loadMap, saveMap, showError, hideError}}