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
        // const userId = ctx.query.userId;
        // if(!userId) ctx.throw(404, `args not valid`);
        const loginUser =  ctx.session.loginUser
        if(!loginUser){
            ctx.body = {
                code:"404",
                data:{
                    success:false,
                    msg:'not login'
                }
            }
            return;
        }
        const result = await ScoreDAO.getScoresByUserId(loginUser.id);
        let finalResult = result.map((item)=>{
            return {
                num:item.num,
                time:item.createdAt
            }
        })||[];
        ctx.body = {
            code:"200",
            data:finalResult
        }
    }

    static async getTop(ctx){
        const num = parseInt(ctx.query.num);
        const defaultNum = 10;
        const result = await ScoreDAO.getTop(num||defaultNum);
        let finalResult = result.map((item)=>{
            return{
                name:item.user.firstname,
                num:item.num
            }
        })||[];
        ctx.body = {
            code:"200",
            data:finalResult
        }
    }

    static async getLatestScore(ctx){
        const loginUser =  ctx.session.loginUser
        if(!loginUser){
            ctx.body = {
                code:"404",
                data:{
                    success:false,
                    msg:'not login'
                }
            }
            return;
        }
        const latestNum = parseInt(ctx.query.num) || 1;
        const result = await ScoreDAO.getLatest(loginUser.id,latestNum);
        let finalResult = result.map((item)=>{
            return{
                num:item.num,
                time:item.createdAt
            }
        })||[];
        ctx.body = {
            code:"200",
            data:finalResult
        }
    }

    static async postScore(ctx){
        const {userId,num} = ctx.request.body
        const result = await ScoreDAO.saveScore(userId,num)

        ctx.body = {
            "code":200,
             data:result?"保存成功":"保存失败"
        }
    }
}


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

module.exports = ScoreService;
