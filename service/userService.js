/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  API service - userService.js                                                                  */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';

const castBoolean  = require('./cast-boolean.js');
const UserDAO = require('../dao/userDAO.js');
const ScoreDAO = require('../dao/scoreDAO.js');
const jwt    = require('jsonwebtoken');
const COOKIE_NAME = 'mjsj:jwt'

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
        if(ctx.cookies.get(COOKIE_NAME)){
            ctx.body = {
                code:"200",
                data:{
                    success:true
                }
            }
            return;
        }
        const username = ctx.request.body.username;
        const password = ctx.request.body.password;
        if(!username||!password){
            ctx.body = {
                code:"200",
                data:{
                    success:false,
                    msg:"arg not valid"
                }
            }
            return 
        }
        // let [user] = await UserDAO.getBy('email', username); // lookup user
        let [user] = await UserDAO.getByEmail( username); // lookup user

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

            ctx.cookies.set(COOKIE_NAME, token, options);
            // if we were provided with a redirect URL after the /login, redirect there, otherwise /
            // ctx.redirect(ctx.url=='/login' ? '/' : ctx.url.replace('/login', ''));
            ctx.body = {
                code:"200",
                data:{
                    success:true
                }
            }
        } else {
            // login failed: redisplay login page with login fail message
            const loginfailmsg = 'E-mail / password not recognised';
            ctx.body = {
                code:"200",
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
        ctx.cookies.set(COOKIE_NAME,null , {signed: true,expires:new Date(1900,0,1)}); // delete the cookie holding the JSON Web Token
        ctx.body={
            code:"200",
            data:{
                sucess:true
            }
        }
    }

    static async doSomething(ctx){
        let s = ctx.cookies.get(COOKIE_NAME)
        if(ctx.cookies.get(COOKIE_NAME)){
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
