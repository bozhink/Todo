var express = require('express'),
    app = express(),
    engines = require('consolidate'),
    bodyParser = require('body-parser'),
    MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

app.engine('html', engines.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(express.static(__dirname + 'public'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use('/css', express.static(__dirname + '/css'));

function errorHandler(err, req, res, next) {
    console.error(err.message);
    console.error(err.stack);
    res.status(500)
        .render('error-template', {
            error: err
        });
}

app.use(errorHandler);

MongoClient.connect('mongodb://localhost:27017/video', function(err, db) {
    assert.equal(null, err);
    console.log('Successfully connected to MongoDB.');

    var server, port = process.env.PORT || 3013,
        usersRouter = require('./routers/usersRouter')(db),
        todosRouter = require('./routers/todosRouter')(db),
        eventsRouter = require('./routers/eventsRouter')(db),
        categoriesRouter = require('./routers/categoriesRouter')(db);

    require('./utils/authorized-user')(app, db);

    app.use('/api/users', usersRouter);
    app.use('/api/todos', todosRouter);
    app.use('/api/events', eventsRouter);
    app.use('/api/categories', categoriesRouter);

    server = app.listen(port, function() {
        var port = server.address().port;
        console.log('Server is running at http://localhost:%s', port);
    });
});