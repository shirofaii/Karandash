var React = require('react')
var render = require('react-dom').render
var Root = require('./containers/Root')
var createMainStore = require('./store/mainStore')

const store = createMainStore();

render(React.createElement(Root, {store}), document.getElementById('rootPageContainer'));
