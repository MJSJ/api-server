
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
            },
            order: [
                ['num', 'DESC']
            ]
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

    static async getLatest(id,num) {
        const scores =  await model.score.findAll({
            order: [
                ['createdAt', 'DESC']
            ],
            limit: num,
            where:{
                userId:id
            },
            include: [{
                model:model.user,
                attributes:['firstname']
            }],
            attributes: ['num','createdAt']
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
