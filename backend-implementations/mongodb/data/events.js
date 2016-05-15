const DEFAULT_NUMBER_OF_ITEMS_PER_PAGE = 10;

function EventDAO(database) {
    'use strict';

    eventsCollection = database.collection('events');

    this.getEvents = function(userId, page, numberOfItemsPerPage, callback) {
        page = +(page || 0);
        numberOfItemsPerPage = +(numberOfItemsPerPage || DEFAULT_NUMBER_OF_ITEMS_PER_PAGE);

        eventsCollection.find({
                'creatorId': userId
            })
            .skip(page * numberOfItemsPerPage)
            .limit(numberOfItemsPerPage)
            .toArray(function(err, events) {
                if (err != null || events == null) {
                    callback(null);
                } else {
                    callback(events);
                }
            });
    };
    
    this.addEvent = function(userId, event, callback) {
        
    }
}

module.exports.EventDAO = EventDAO;