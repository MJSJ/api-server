class CsrfService {
    static async setToken (ctx) {
        ctx.session.csrf = ctx.query.csrf || '';
        ctx.body = 'Yeah!';
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