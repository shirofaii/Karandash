var React = require('react');
var Redux = require('react-redux');
var MapEditor = require('./MapEditor.jsx');


var Root = React.createClass({
    propTypes: {
        
    },

    render: function() {
        return <MapEditor />
    }
});

module.exports = Root;
