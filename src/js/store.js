import { createStore, applyMiddleware, compose } from 'redux';
var rootReducer = require('./reducers');

function createMainStore() {
    let devTool = f => f;
    if (typeof window !== 'undefined') {
        if (window.devToolsExtension) {
            devTool = window.devToolsExtension()
        }
    }

    let finalCreateStore = compose(
        devTool
    )(createStore);

    return finalCreateStore(rootReducer);
}

module.exports = createMainStore