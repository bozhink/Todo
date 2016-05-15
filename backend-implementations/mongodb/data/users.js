function UserDAO(database) {
    'use strict';
    
    this.db = database;
    this.usersCollection = this.db.collction('users');
    
    this.getUsers = function (page, numberOfItemsPerPage, callback) {
        page = parseInt(page);
        if (page < 0) {
            throw new Error('Page number should be positive.');
        }
        
        numberOfItemsPerPage = parseInt(numberOfItemsPerPage);
        if (numberOfItemsPerPage < 1) {
            throw new Error('Number of items per page should be greater than 0.')
        }
        
        this.usersCollection.find()
            .sort({
                'usernameLower': 1
            })
            .skip(page * numberOfItemsPerPage)
            .limit(numberOfItemsPerPage)
            .toArray(function (err, users) {
                if (!!err) {
                    throw err;
                }
                
                callback(users);
            });
    }
}

module.exports.UserDAO = UserDAO;

