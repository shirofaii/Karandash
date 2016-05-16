var React = require('react')
var render = require('react-dom').render
var createStore = require('./store')
var Provider = require('react-redux').Provider;
var Root = require('./comp/Root.jsx');

const store = createStore();

render(
<Provider store={store}>
    <Root />
</Provider>
, document.getElementById('root'));
