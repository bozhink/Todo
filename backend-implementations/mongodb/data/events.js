function EventDAO(database) {
    'use strict';
    
    this.db = database;
    this.eventsCollection = this.db.collection('events');
    
    this.getEvents = function (userId, callback) {
        this.eventsCollection.find({
            '_id': userId
        }).toArray(function (err, events) {
            if (!!err) {
                throw err;
            }
            
            callback(events);
        })
    };
}

module.exports.EventDAO = EventDAO;
