/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  API handlers - Wx                                                                        */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
'use strict';
const APPID = 'wxd0124a9e51032874';
const SECRET = 'a64c71252df6a6611e893c2ba53adf35';
const TOKEN_URL = 'https://api.weixin.qq.com/sns/oauth2/access_token';
const BASE_TOKEN_URL='https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential';
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

    // 获取基础的access_token
    static async get_base_token () {
        let url = BASE_TOKEN_URL + '&appid=' + APPID + '&secret=' + SECRET;
        return axios.get(url)
                .then(res => {
                    if('errcode' in res.data){
                        console.info(url + ' 请求失败：' +　res.data.errmsg);
                        return {access_token: ''};
                    } else {
                        return res.data;
                    }
                });
    }

    // 获取授权登陆的access_token
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

    // 获取JS-SDK的ticket
    static async get_base_ticket (access_token) {
        let url = TICKET_URL + '?access_token=' + access_token + '&type=jsapi';
        return axios.get(url)
                .then(res => {
                    if(res.data.errcode === 0){
                        return res.data.ticket; 
                    } else {
                        return null;
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

    static async setStateToken () {
        let token = await WxService.get_base_token();
        if(token.access_token){
            this.access_token = {
                value: token.access_token,
                created_at: Date.parse(new Date())/1000
            }
        }
        return token.access_token;
    }

    static async setStateTicket (token) {
        let ticket = await WxService.get_base_ticket(token);
        if(ticket){
            this.ticket = {
                value: ticket,
                created_at: Date.parse(new Date())/1000
            }
        }
        return ticket;
    }

    static async get_token () {
        let token;
        if(this.hasOwnProperty('access_token')){
            let created_at = this.access_token.created_at;
            let now = Date.parse(new Date())/1000;
            if(now - created_at > 7000){
                delete this.access_token;
                token = await WxService.setStateToken();
            } else {
                return this.access_token.value;
            }
        } else {
            token = await WxService.setStateToken();
        }
        return token;
    }

    static async get_tickect (token) {
        let ticket;
        if(this.hasOwnProperty('ticket')){
            let created_at = this.ticket.created_at;
            let now = Date.parse(new Date())/1000;
            if(now - created_at > 7000){
                delete this.ticket;
                ticket = await WxService.setStateTicket(token);
            } else {
                return this.ticket.value;
            }
        } else {
            ticket = await WxService.setStateTicket(token);
        }
        return ticket;
    }

    static async get_js_ticket () {
        let token = await WxService.get_token();
        return await WxService.get_tickect(token);
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
            ticket: ticket,
            timestamp: timestamp,
            nonceStr: noncestr,
            signature: sha1(string1),
            url: url,
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