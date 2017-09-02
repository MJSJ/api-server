'use strict';

const UserDAO = require('../dao/userDAO.js');
const SubjectDAO = require('../dao/subjectDAO.js');
const Lib        = require('../lib/lib.js');
const loginInterceptor  = require("../lib/loginInterceptor").loginInterceptor;
const adminInterceptor  = require("../lib/loginInterceptor").adminInterceptor;

function log(target, name, descriptor) {
    var oldValue = descriptor.value;
  
    descriptor.value = function() {
      console.log(`Calling "${name}" with`, arguments);
      return oldValue.apply(null, arguments);
    };
  
    return descriptor;
  }
  
class SubjectService {

    static async fetchSubjectList(ctx){
        if(loginInterceptor(ctx)) return 

        const loginUser =  ctx.session.loginUser
        //status = 1     返回没有owner的list
        const status = parseInt(ctx.query.status);
        let result;
        //管理员所有的都能看到
        if(loginUser.role == 2)
            result = await SubjectDAO.getSubjectList({status})
        else
            result = await SubjectDAO.getSubjectList({userID:loginUser.id,status})

        let sResult = [];

        //COMPOSE DATA
        result.map((item)=>{
            let sItem = {}
            if(item.user){
                sItem.owner = {
                    name:item.user.name,
                    id:item.user.id
                }
            }
            if(item.histories&&item.histories.length>0){
                sItem.lastEdit = {
                    userName:item.histories[0].user.name,
                    time:item.histories[0].createdAt,
                }
            }
            sItem.name = item.name;
            sItem.id = item.id;
            sResult.push(sItem)
        })
        ctx.body = {
            code:"200",
            data:sResult
        }
    }

    static async updateSubject(ctx){
        if(loginInterceptor(ctx)) return 
        const loginUser =  ctx.session.loginUser
        const {subjectID,content,tag,subjectName} = ctx.request.body

       
        try{
            //先存fs
            let url = await SubjectService.saveHTML(content);
            let result;
            if(!subjectID){
                //新建专题
                result = await SubjectDAO.addSubject(url,tag,loginUser.id,subjectName);
            }else{
                //更改专题 ==》添加历史
                result = await SubjectDAO.addHistory(url,tag,loginUser.id,subjectID)
            }

            ctx.body = {
                code:"200",
                data:{
                    success:result
                }
            }
        }catch(e){
            console.error(e)
            Lib.logException('add or update subject fialed:  ', e)
            ctx.body = {
                code:"400",
                data:{
                    success:false,
                    msg:e
                }
            }
        }

        
    }

    static async fetchSubject(ctx){
        if(loginInterceptor(ctx)) return 
            
        const loginUser =  ctx.session.loginUser
        const subjectID = parseInt(ctx.query.subjectID);
        try{
            let result;
            if(loginUser.role == 2){
                result = await SubjectDAO.getSubject(subjectID)
            }else{
                result = await SubjectDAO.getSubject(subjectID,loginUser.id)
            }
            if(!result){
                ctx.body = {
                    code:"200",
                    data:{
                        success:true,
                        data:null
                    }
                }
            }else{
                let sResult;
                sResult = {
                    name:result.name,
                    id:result.id,
                    owner:{
                        name:result.user.name,
                        id:result.user.id
                    },
                    history:[]
                }
                if(result.histories&&result.histories.length>0){
                    result.histories.map((item)=>{
                        sResult.history.push(
                            {
                                tag:item.tag,
                                content:item.content,
                                time:item.createdAt,
                                userName:item.user.name
                            }
                        )
                    })
                }

                ctx.body = {
                    code:"200",
                    data:sResult
                }
            }
        }catch(e){
            console.error(e)
            Lib.logException('fetch subject fialed:  ', e)
            ctx.body = {
                code:"404",
                data:{
                    success:false,
                    msg:e
                }
            }
        }

        
    }

    static async deleteSubject(ctx){
        if(loginInterceptor(ctx)) return 
        const loginUser =  ctx.session.loginUser
        const {subjectID} = ctx.request.body

        try{
            if(loginUser.role == 2){
                await SubjectDAO.deleteSubject(subjectID)
            }else{
                await SubjectDAO.deleteSubject(subjectID,loginUser.id)
            }
            ctx.body = {
                code:"200",
                data:{
                    success:true
                }
            }
        }catch(e){
            console.error(e);
            Lib.logException('delete subject fialed:  ', e)
            ctx.body = {
                code:"404",
                data:{
                    success:false,
                    msg:e
                }
            }
        }
    }

    //FS
    static async saveHTML(content){
        try{
            //TODO
            return content
        }catch(e){
            console.error(e);
            Lib.logException('fs save html fialed:  ', e)
            throw(e)
        }

    }


    // static async addHistory(){
    //     const loginUser =  ctx.session.loginUser
    //     if(!loginUser){
    //         ctx.body = {
    //             code:"404",
    //             data:{
    //                 success:false,
    //                 msg:'not login'
    //             }
    //         }
    //         return;
    //     }

    //     const {subjectID,content,tag,subjectName} = ctx.request.body
    //     let result;
    //     try{
    //         result = await SubjectDAO.addHistory(url,tag,loginUser.id,subjectID)
    //     }catch(e){
    //         console.error(e);
    //         Lib.logException('history add fialed:  ', e)
    //         throw(e)
    //     }

    // }




    static async updateCompany(ctx){
        if(adminInterceptor(ctx)) return 
        
        //name:公司名字
        const {name,password,id,subjectList} = ctx.request.body
        try{
            // 修改
            let result;
            if(id)
                result = SubjectDAO.updateCompany(id,subjectList);
            else
                result = SubjectDAO.addCompany(name,password,subjectList)

            //没有异常就返回
            if(result)
                ctx.body = {
                    code:"200",
                    data:{
                        success:true
                    }
                }
            else
                ctx.body = {
                    code:"404",
                    data:{
                        success:false,
                        msg:'操作失败'
                    }
                }
        }catch(e){
            console.error(e)
            throw e
            ctx.body = {
                code:"404",
                data:{
                    success:false,
                    msg:'操作失败'
                }
            }
        }
    }
    
}




/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

module.exports = SubjectService;
