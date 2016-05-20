var server,
    port = process.env.PORT || 3013,
    express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    low = require('lowdb'),
    db = low('data/data.json');

db._.mixin(require('underscore-db'));

app.use(bodyParser.json());
app.use(express.static('public'));

var usersRouter = require('./routers/usersRouter')(db);
var todosRouter = require('./routers/todosRouter')(db);
var eventsRouter = require('./routers/eventsRouter')(db);
var categoriesRouter = require('./routers/categoriesRouter')(db);

require('./utils/authorized-user')(app, db);

app.use('/api/users', usersRouter);
app.use('/api/todos', todosRouter);
app.use('/api/events', eventsRouter);
app.use('/api/categories', categoriesRouter);

server = app.listen(port, function () {
    var port = server.address().port;
    console.log('Server is running at http://localhost:%s', port);
});
