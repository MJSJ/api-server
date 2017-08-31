'use strict';

const UserDAO = require('../dao/userDAO.js');
const SubjectDAO = require('../dao/subjectDAO.js');
class SubjectService {

    static async fetchSubjectList(ctx){
        const loginUser =  ctx.session.loginUser
        if(!loginUser){
            ctx.body = {
                code:"404",
                data:{
                    success:false,
                    msg:'not login'
                }
            }
            return;
        }

        let result;
        //管理员所有的都能看到
        if(loginUser.role == 2)
            result = await SubjectDAO.getSubjectList()
        else
            result = await SubjectDAO.getSubjectList(loginUser.id)

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
        const loginUser =  ctx.session.loginUser
        if(!loginUser){
            ctx.body = {
                code:"404",
                data:{
                    success:false,
                    msg:'not login'
                }
            }
            return;
        }
        const {subjectID,content,tag} = ctx.request.body

       
        try{
            if(!subjectID){
                //新建专题
                const result = await SubjectDAO.addSubject(content,tag,loginUser.id);
            }else{
                //更改专题 ==》添加历史
                const result = await SubjectDAO.addHistory(content,tag,loginUser.id,subjectID)
            }

            ctx.body = {
                code:"200",
                data:{
                    success:result
                }
            }
        }catch(e){
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
        const loginUser =  ctx.session.loginUser
        const subjectID = parseInt(ctx.query.subjectID);
        if(!loginUser){
            ctx.body = {
                code:"404",
                data:{
                    success:false,
                    msg:'not login'
                }
            }
            return;
        }

        try{
            let result;
            if(loginUser.role == 2){
                result = await SubjectDAO.getSubject(subjectID)
            }else{
                result = await SubjectDAO.getSubject(subjectID,loginUser.id)
            }
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
        }catch(e){
            console.error(e)
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
        const loginUser =  ctx.session.loginUser
        if(!loginUser){
            ctx.body = {
                code:"404",
                data:{
                    success:false,
                    msg:'not login'
                }
            }
            return;
        }

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
            ctx.body = {
                code:"404",
                data:{
                    success:false,
                    msg:e
                }
            }
        }
    }
    
}




/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

module.exports = SubjectService;
