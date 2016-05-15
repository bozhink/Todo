var app, express = require('express'),
    bodyParser = require('body-parser'),
    mongoClient = require('mongodb').MongoClient;

app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

mongoClient.connect('mongodb://localhost:27017/todos', function(err, db) {
    var usersRouter = require('./routers/usersRouter')(db),
        todosRouter = require('./routers/todosRouter')(db),
        eventsRouter = require('./routers/eventsRouter')(db),
        categoriesRouter = require('./routers/categoriesRouter')(db);

    require('./utils/authorized-user')(app, db);

    app.use('/api/users', usersRouter);
    app.use('/api/todos', todosRouter);
    app.use('/api/events', eventsRouter);
    app.use('/api/categories', categoriesRouter);

    var port = process.env.PORT || 3013;

    app.listen(port, function() {
        console.log('Server is running at http://localhost:' + port);
    })
});