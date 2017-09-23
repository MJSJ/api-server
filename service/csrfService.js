/**
 * 
 * 此类无用
 */

class CsrfService {
    static async setToken (ctx) {
    
        const ssid = ctx.query.mjsj;
        console.log(sid)
        const csrf = ctx.query.token;
       
        ctx.session.csrf = csrf || '';
        ctx.body = {
            success: true,
            code:"200"
        }

    }

    static async test (ctx) {
        ctx.body = {
            success: true,
            data: [1,2,3]
        };
    }
}


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

module.exports = CsrfService;