function loginInterceptor(ctx) {
    if(!ctx.session.loginUser){
        ctx.body = {
            code:"204",
            data:{
                notLogin:true,
                success:false,
                msg:'not login'
            }
        }
        return true;
    }
}

function adminInterceptor(ctx) {
    if (loginInterceptor(ctx)) return true
    if(ctx.session.loginUser.role!=2){
        ctx.body = {
            code:"204",
            data:{
                success:false,
                msg:'no privilege'
            }
        }
        return true;
    }
}

function csrfInterceptor(ctx){
    // let a = csrf.verify(ctx.session.secret, ctx.csrf)
    // console.log(a)
    // if(ctx)
    const { _csrf } = ctx.request.body;
    if(!_csrf || _csrf !== ctx.session.secret){
        ctx.body = {
            code:"403",
            data:{
                success:false,
                msg:'csrf failed'
            }
        }
        return true;
    }
}

module.exports = {
    loginInterceptor,
    adminInterceptor,
    csrfInterceptor
}
