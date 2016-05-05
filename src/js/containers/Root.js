var React = require('react');
var Provider = require('react-redux').Provider;

var Root = React.createClass({
    propTypes: {
        store: React.PropTypes.object.isRequired
    },

    render: function() {
        return (
            <Provider store={this.props.store} key="provider" />
        );
    }
});

module.exports = Root;
