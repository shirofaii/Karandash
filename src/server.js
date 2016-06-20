var Express = require('express')
var compression = require('compression')

const app = new Express();

app.use(compression());
app.use('/', Express.static('wwwroot'));

var port = process.env.PORT || 1234;

app.listen(port, function() {
    console.log('==> Server listened on port ', port);
});
