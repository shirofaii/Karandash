var React = require('react'),
    render = require('react-dom').render,
    Root = require('./containers/Root');

import { createMainStore } from './store/mainStore';

const store = createMainStore();

render(<Root store={store} />, document.getElementById('rootPageContainer'));
