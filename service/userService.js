/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  API handlers - Users                                                                        */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';

// const User       = require('../models/user.js');
const castBoolean  = require('./cast-boolean.js');
const UserDAO = require('../dao/userDAO.js');
const ScoreDAO = require('../dao/scoreDAO.js');

class UserService {

    static async getUsers(ctx) {
        try {
            const users = await UserDAO.getAll();
            ctx.body = users;
        } catch (e) {
            switch (e.code) {
                case 'ER_BAD_FIELD_ERROR': ctx.throw(403, 'Unrecognised User field'); break;
                default: throw e;
            }
        }
    }

    static async getUserById(ctx) {
        const userId = ctx.query.userId;
        if(!userId) ctx.throw(404, `args not valid`); 
        const result = await UserDAO.getById(userId);
        const user = result;

        if (!user) ctx.throw(404, `No user ${userId} found`); // Not Found
        ctx.body = user;
    }

}


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

module.exports = UserService;
