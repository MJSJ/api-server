'use strict';

const UserDAO = require('../dao/userDAO.js');
const SubjectDAO = require('../dao/SubjectDAO.js');
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
        const result = await SubjectDAO.getSubjectList(loginUser.id)
        let sResult = [];
        result.map((item)=>{
            // item.history
            let sItem = {}
            if(item.user){
                sItem.owner = {
                    name:item.user.name,
                    id:item.user.id
                }
            }
            if(item.histories){
                console.log(item.histories[0].createdAt)
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

        const result = await SubjectDAO.getSubject(subjectID)

        ctx.body = {
            code:"200",
            data:result
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
        const result = await SubjectDAO.deleteSubject(subjectID)
        ctx.body = {
            code:"200",
            data:result
        }
    }
    
}




/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

module.exports = SubjectService;
