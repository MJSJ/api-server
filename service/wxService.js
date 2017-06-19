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

class WxService {

    static get_access_token (c) {
        new Promise((resolve, reject) =>{
            axios.get(TOKEN_URL, {
                appid: APPID,
                secret: SECRET,
                code: c,
                grant_type: GRANT_TYPE
            }).then(res => resolve(res));
        }).then((res) => {
            console.info(res.data);
        });
    }

    static async authWxLogin(ctx) {
        let c = ctx.cookies.get('c');
        let path = ctx.query.state;
        let code = ctx.query.path;
        let authUser = null;
        if (c === undefined) {
            let  access_token = WxService.get_access_token(code);

        } else {

        }

        ctx.body = 'auth';
    }

}


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

module.exports = WxService;