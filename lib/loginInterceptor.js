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
    if(ctx.session.loginUser!=2){
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

module.exports = {
    loginInterceptor,
    adminInterceptor
}
