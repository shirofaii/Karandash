var Express = require('express')

const app = new Express();

app.use('/', Express.static('wwwroot'));

var port = process.env.PORT || 3000;

app.listen(port, function() {
    console.log('==> Server listened on port ', port);
});
