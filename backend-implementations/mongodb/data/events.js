const DEFAULT_NUMBER_OF_ITEMS_PER_PAGE = 10;

function EventDAO(database) {
    'use strict';

    var eventsCollection = database.collection('events'),
        usersCollection = database.collection('users');

    this.getEvents = function(userName, page, numberOfItemsPerPage, callback) {
        page = +(page || 0);
        numberOfItemsPerPage = +(numberOfItemsPerPage || DEFAULT_NUMBER_OF_ITEMS_PER_PAGE);

        usersCollection.findOne({
            'usernameLower': userName.toLowerCase()
        }, function(err, user) {
            if (err != null || user == null) {
                callback(null);
            } else {
                eventsCollection.find({
                        'creatorId': user._id.toString()
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
            }
        });

    };

    this.addEvent = function(userName, eventUsersNames, event, callback) {
        usersCollection.findOne({
            'usernameLower': userName.toLowerCase()
        }, function(err, user){
            if (err != null || user == null) {
                callback(null);
            } else {
                // TODO: get event users
            }
        })
    }
}

module.exports.EventDAO = EventDAO;