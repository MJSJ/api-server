/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  API handlers - Wx                                                                        */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
'use strict';

const axios = require('axios');

const APPID = 'wxd0124a9e51032874';
const SECRET = 'a64c71252df6a6611e893c2ba53adf35';
const TOKEN_URL = 'https://api.weixin.qq.com/sns/oauth2/access_token';
const USER_URL = 'https://api.weixin.qq.com/sns/userinfo';
const GRANT_TYPE = 'authorization_code';
const AUTH_URL = 'https://api.weixin.qq.com/sns/userinfo';

class WxService {

    static async get_access_token (c) {
        let url = TOKEN_URL + '?' 
                    + 'appid=' + APPID 
                    + '&secret=' + SECRET 
                    + '&code=' + c 
                    + '&grant_type=' + GRANT_TYPE;
        return new Promise((resolve, reject) =>{
                axios.get(url).then(res => resolve(res));
            }).then(res => {
                if('errcode' in res.data){
                    console.info(url + ' 请求失败：' +　res.data.errmsg);
                    return {access_token: '', openid: ''};
                } else {
                    return res.data;
                }
            });
    }

    static async get_wx_user (data) {
        let url = AUTH_URL + '?' +
                    'access_token=' + data.access_token + 
                    "&openid=" + data.openid + 
                    "&lang=zh_CN";
        return new Promise((resolve, reject) =>{
                axios.get(url).then(res => resolve(res));
            }).then(res => {
                if('errcode' in res.data){
                    console.info(url + ' 请求失败：' +　res.data.errmsg);
                    return null;
                } else {
                    return res.data;
                }
            });
    }

    static async authWxLogin(ctx) {
        let c = ctx.cookies.get('c');
        let path = ctx.query.state;
        let code = ctx.query.code;
        let authUser = null;
        if (c === undefined) {
            // 2天内未授权过 或 从未授权过的用户
            let data = await WxService.get_access_token(code);
            let user = await WxService.get_wx_user(data);
            if(user !== null){
                console.info(user);
            } else {
                ctx.throw(500, '授权失败!');
            }
        } else {
            // 授权过的用户

        }
    }

}


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

module.exports = WxService;