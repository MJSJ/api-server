'use strict';

const Lib        = require('../lib/lib.js');
const ModelError = require('../models/modelerror.js');
const model  = require('../models/index.js');

class UserDAO {

    static async getById(id) {
        const users = await model.user.findAll({
            where: {
                id: id
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
            const users = await model.user.findAll({
                where: {
                    [field]: value
                },
                order:[
                    ['name', 'DESC']
                ]
            })

            return users;
        } catch (e) {
            switch (e.code) {
                case 'ER_BAD_FIELD_ERROR': throw new ModelError(403, 'Unrecognised User field '+field);
                default: Lib.logException('model.User.getBy', e); throw new ModelError(500, e.message);
            }
        }
    }

    static async addUser(name,password){
        try{
            const user = await model.user.create({
                name:name,
                password:password
            })
            return user;
        }catch(e){
            console.error(e)
            throw(e)
        }
    }

    static async deleteUser(userID){
        try{
            await model.user.destroy({
                where: { 
                    id: userID
                }
            })
            return true
        }catch(e){
            console.error(e)
            throw(e)
            return false
        }
    }

    

    static async getByEmail(value) {
        try {
            const users = await model.user.findAll({
                where: {
                    email: value
                }
            })
            return users;

        } catch (e) {
            switch (e.code) {
                case 'ER_BAD_FIELD_ERROR': throw new ModelError(403, 'Unrecognised User field '+field);
                default: Lib.logException('model.user.getBy', e); throw new ModelError(500, e.message);
            }
        }
    }


}


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

module.exports = UserDAO;
