
'use strict';

const Lib        = require('../lib/lib.js');
const ModelError = require('../models/modelerror.js');
const model  = require('../models/index.js');
const Sequelize = require("sequelize");

class ScoreDAO {
    static async getScoresByUserId(id) {
        const scores = await model.score.findAll({
            attributes: { exclude: ['id'] },
            where: {
                id: id
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
            include: [model.user]
        })
        return scores;
    }

    static async saveScore(userId,num){
        try {
            await model.score.create({
                num:num,
                userId:userId
            }) 
            return "保存成功"
        } catch (error) {
            return "保存失败"
        }
    }
}


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

module.exports = ScoreDAO;
