'use strict';

const Lib        = require('../lib/lib.js');
const ModelError = require('../models/modelerror.js');
const model  = require('../models/index.js');

class UserDAO {

    static async getById(id) {
        const users = await model.user.findAll({
            where: {
                UserId: id
            }
        })

        return users[0]
    }

    static async getAll() {
        const users =  await model.user.findAll({
            include: [model.score]
        })
        return users;
    }

    static async getBy(field, value) {
        try {
            model.User.findAll({
                where: {
                    [field]: field
                },
                order:[
                    ['firstname', 'DESC'],
                    ['lastname', 'DESC']
                ]
            }).then(function(users) {
                return users;
            });

        } catch (e) {
            switch (e.code) {
                case 'ER_BAD_FIELD_ERROR': throw new ModelError(403, 'Unrecognised User field '+field);
                default: Lib.logException('model.User.getBy', e); throw new ModelError(500, e.message);
            }
        }
    }


}


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

module.exports = UserDAO;
