
'use strict';

const Lib        = require('../lib/lib.js');
const ModelError = require('../models/modelerror.js');
const model  = require('../models/index.js');
const sequelize = model.sequelize;

class ScoreDAO {
    static async getScoresByUserId(id) {
        const scores = await model.score.findAll({
            attributes: { exclude: ['id','userId'] },
            where: {
                userId: id
            }
        })
        return scores
    }

    static async getAll() {
        const scores =  await model.score.findAll()
        return scores;
    }
    
    static async getTop(num) {
        const scores =  await model.score.findAll({
            order: [
                // Will escape username and validate DESC against a list of valid direction parameters
                ['num', 'DESC']
            ],
            limit: num,
            include: [{
                model:model.user,
                // through: {attributes: []},
                attributes:['firstname']
            }],
            attributes: ['num']
        })
        return scores;
    }

    static async saveScore(userId,num){
        try {
            await model.score.create({
                num:num,
                userId:userId
            }) 
            return true
        } catch (error) {
            return false
        }
    }
}


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

module.exports = ScoreDAO;
