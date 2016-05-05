var redux = require('redux')

function placeholder(state, action) {
    return {}
}


const rootReducer = redux.combineReducers({
    placeholder
});

export default rootReducer;
