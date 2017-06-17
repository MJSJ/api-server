/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  API handlers - Users                                                                        */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';

// const User       = require('../models/user.js');
const castBoolean  = require('./cast-boolean.js');
const UserDAO = require('../dao/userDAO.js');
const ScoreDAO = require('../dao/scoreDAO.js');

class ScoreService {

    static async getScoresByUser(ctx){
        const userId = ctx.query.userId;
        if(!userId) ctx.throw(404, `args not valid`); 
        const result = await ScoreDAO.getScoresByUserId(userId);
        if (!result) ctx.throw(404, `No scores ${userId} found`); // Not Found
        ctx.body = result;
    }
    static async getTop(ctx){
        const num = ctx.query.num;
        const defaultNum = 10;
        const result = await ScoreDAO.getTop(num||defaultNum);
        if (!result) ctx.throw(404, `No scores found`); // Not Found
        ctx.body = result;
    }
    static async postScore(ctx){
        const {userId,num} = ctx.request.body
        const result = await ScoreDAO.saveScore(userId,num)
        ctx.body = {
            "code":200,
            resp:result
        }
        
    }
}


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

module.exports = ScoreService;
