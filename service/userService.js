/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  API service - userService.js                                                                  */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';

const castBoolean  = require('./cast-boolean.js');
const UserDAO = require('../dao/userDAO.js');
const ScoreDAO = require('../dao/scoreDAO.js');
const jwt    = require('jsonwebtoken');

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

    static async postLogin(ctx) {
        if(ctx.session.loginUser){
            ctx.body = {
                code:"200",
                data:{
                    success:true,
                    user: {
                        id: ctx.session.loginUser.id,
                        name: ctx.session.loginUser.name,
                        role: ctx.session.loginUser.role
                    },
                    _csrf:ctx.session.secret
                }
            }
            return;
        }
        //email 和 userID都可以登录
        const username = ctx.request.body.username;
        const password = ctx.request.body.password;
        const userID = ctx.request.body.userID;
        if((!userID&&!username)||!password){
            ctx.body = {
                code:"204",
                data:{
                    success:false,
                    msg:"arg not valid"
                }
            }
            return 
        }
        let user;
        if(username){
            [user] = await UserDAO.getBy('email', username); // lookup user
        }else{
            [user] = await UserDAO.getBy('id', userID); // lookup user
        }

        if (user) { // verify password matches
            try {
                // const match = await scrypt.verifyKdf(Buffer.from(user.Password, 'base64'), password);
                const match = user.password == password;
                if (!match) user = null; // bad password
            } catch (e) {
                user = null; // e.g. "data is not a valid scrypt-encrypted block"
            }
        }

        if (user) {
            // submitted credentials validate: create JWT & record it in a cookie
            const payload = {
                id:       user.id,                                    // to get user details
                remember: ctx.request.body['remember-me'] ? true : false, // whether token can be renewed
            };
            const token = jwt.sign(payload, 'mjsj-signature-key', { expiresIn: '24h' });

            // record the jwt payload in ctx.state.user
            ctx.state.user = payload;

            // record token in signed cookie; if 'remember-me', set cookie for 1 week, otherwise set session only
            const options = { 
                signed: true,
                // secure:true
            };
            if (ctx.request.body['remember-me']) options.expires = new Date(Date.now() + 1000*60*60*24*7);

            ctx.session.loginUser = user;
            // if we were provided with a redirect URL after the /login, redirect there, otherwise /
            // ctx.redirect(ctx.url=='/login' ? '/' : ctx.url.replace('/login', ''));
            ctx.body = {
                code:"200",
                data:{
                    success:true,
                    user: {
                        id: user.id,
                        name: user.name,
                        role: user.role
                    },
                    _csrf:ctx.session.secret
                }
            }
        } else {
            // login failed: redisplay login page with login fail message
            const loginfailmsg = 'E-mail / password not recognised';
            ctx.body = {
                code:"204",
                data:{
                    success:false,
                    msg:loginfailmsg
                }
            }
            // ctx.flash = { formdata: ctx.request.body, loginfailmsg: loginfailmsg };
            // ctx.redirect(ctx.url);
        }
    }

    /**
     * GET /logout - logout user
     */
    static async getLogout(ctx) {
        ctx.session.loginUser = null;
        ctx.body={
            code:"200",
            data:{
                sucess:true
            }
        }
    }

    static async deleteUser(ctx) {

        if(!ctx.session.loginUser||ctx.session.loginUser.role!==2){
            ctx.body = {
                code:"204",
                data:{
                    success:false,
                    msg:'not login or no privilege'
                }
            }
            return;
        }
        const {userID} = ctx.request.body
        if(!userID)
            ctx.body = {
                code:"400",
                data:{
                    success:false,
                    msg:"参数不合法"
                }
            }

        try {
            const result = await UserDAO.deleteUser(userID);
            if (result)
                ctx.body = {
                    code:"200",
                    data:{
                        success:true
                    }
                }
            else
                ctx.body = {
                    code:"400",
                    data:{
                        success:false,
                        msg:"操作失败"
                    }
                }
        } catch (error) {
            console.error(error)
            throw(error)
            ctx.body = {
                code:"400",
                data:{
                    success:false,
                    msg:error
                }
            }
        }
        
    }

    static async doSomething(ctx){
        if(ctx.session.loginUser){
            ctx.body = {
                code:"200",
                data:{
                    success:true,
                    msg:"now you can do"
                }
            }
        }else{
            ctx.body = {
                code:"200",
                data:{
                    success:false,
                    msg:"not login,you cant do"
                }
            }
        }
    }
}


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

module.exports = UserService;
