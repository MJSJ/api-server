/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  API handlers - Wx                                                                        */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
'use strict';
const APPID = 'wxd0124a9e51032874';
const SECRET = 'a64c71252df6a6611e893c2ba53adf35';
const TOKEN_URL = 'https://api.weixin.qq.com/sns/oauth2/access_token';
const USER_URL = 'https://api.weixin.qq.com/sns/userinfo';
const GRANT_TYPE = 'authorization_code';
const AUTH_URL = 'https://api.weixin.qq.com/sns/userinfo';
const TICKET_URL = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket'
const EXPIRES = 2;

const axios = require('axios');
const model = require('../models');
const fs = require('fs');
const sha1 = require('sha1');

class WxService {
    static async get_access_token (c) {
        let url = TOKEN_URL + '?' 
                    + 'appid=' + APPID 
                    + '&secret=' + SECRET 
                    + '&code=' + c 
                    + '&grant_type=' + GRANT_TYPE;
        return axios.get(url)
                .then(res => {
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
        return axios.get(url)
                .then(res => {
                    if('errcode' in res.data){
                        console.info(url + ' 请求失败：' +　res.data.errmsg);
                        return null;
                    } else {
                        return res.data;
                    }
                });
    }

    static get_tickect () {
        if(this.state.hasOwnProperty('ticket')){
            let created_at = this.state.ticket.created_at;
            let now = Date.parse(new Date())/1000;
            if(now - created_at > 7000){
                delete this.state.ticket;
            } else {
                return this.state.ticket.value;
            }
        }
        return null;
    }

    static async get_js_ticket () {
        let ticket = WxService.get_tickect();
        if(!ticket){
            let data = await WxService.get_access_token(code);
            if(data.access_token){
                let url = TICKET_URL + '?access_token=' + data.access_token + '&type=jsapi';
                let data = await axios.get(url)
                            .then(res => {
                                if(res.data.errcode === 0){
                                    return res.data.ticket; 
                                } else {
                                    return null;
                                }
                            });
            } else {
                return null;
            }
        } else {
            return ticket;
        }
    }

    // 微信授权JS SDK
    static async getJsSdkConf (ctx) {
        let ticket = await WxService.get_js_ticket();
        let noncestr = Math.random().toString(36).substr(2);
        let timestamp = Date.parse(new Date())/1000;
        let url = ctx.url;
        let string1 = 'jsapi_ticket=' + ticket + '&noncestr=' + noncestr + '&timestamp=' + timestamp + '&url=' + url;
        ctx.body = {
            appId: APPID,
            timestamp: timestamp,
            nonceStr: noncestr,
            signature: sha1(string1),
            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ','onMenuShareWeibo','onMenuShareQZone']
        };
    }

    // 微信授权登录
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
                delete user.privilege;
                let client = await model.client
                                    .findOrCreate({where: {openid: user.openid}, defaults: user})
                                    .spread((client, created) => {
                                        return user;
                                    });
                ctx.cookies.set('c', client.openid, {
                    expires: new Date(new Date().getTime() + EXPIRES*24*60*60*1000)
                });
                ctx.body = client;
            } else {
                ctx.throw(500, '授权失败!');
            }
        } else {
            // 授权过的用户
            let client = await model.client.findOne({where: {openid: c}}).then(client => client);
            if(client === null){
                ctx.cookies.set('c', null);
                ctx.throw(500, '授权失败!');
            }else {
                ctx.body = client;
            }
        }
    }
}


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

module.exports = WxService;