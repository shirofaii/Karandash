var React = require('react')
var render = require('react-dom').render
var createStore = require('./store')
var Provider = require('react-redux').Provider;

const store = createStore();

render(
<Provider store={store}>
    <br />
</Provider>
, document.getElementById('rootPageContainer'));
