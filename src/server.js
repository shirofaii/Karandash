import Express from 'express';

const app = new Express();

app.use('/assets', Express.static('assets'));
app.use('/img', Express.static('img'));
app.use('/index.html', Express.static('index.html'));

var port = process.env.PORT || 3000;

app.listen(port, function() {
    console.log('==> Server listened on port ', port);
});
