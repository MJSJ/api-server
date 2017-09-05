'use strict';

const UserDAO = require('../dao/userDAO.js');
const SubjectDAO = require('../dao/subjectDAO.js');
const Lib        = require('../lib/lib.js');
const loginInterceptor  = require("../lib/loginInterceptor").loginInterceptor;
const adminInterceptor  = require("../lib/loginInterceptor").adminInterceptor;
const path = require("path");
const fs = require("fs");
const STATIC_PATH = path.join(__dirname, '../s');

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
            let resultID;
            let url;
            if(!subjectID){
                //新建专题
                resultID = await SubjectDAO.addSubject(url,tag,loginUser.id,subjectName);
                if(resultID) await SubjectService.saveHTML(content, resultID, 0);
            }else{
                let url = await SubjectService.saveHTML(content, subjectID, 1);
                //更改专题 ==》添加历史
                resultID = await SubjectDAO.addHistory(url,tag,loginUser.id,subjectID)
            }

            if(!resultID)
                ctx.body ={
                    code:"204",
                    data:{
                        success:false,
                        msg:"专题名重复或系统错误"
                    }
                }
            else
                ctx.body = {
                    code:"200",
                    data:{
                        success:true
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
                    sResult.history = await SubjectService.getHTML(result.histories, subjectID);
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

    // render html
    static async renderSubject (ctx) {
        try{
            const subjectId = ctx.params.id;
            let r = fs.readFileSync(path.join(STATIC_PATH, subjectId.toString(), 'index.html'),'utf-8');
            ctx.body = r;
        }catch(e){
            console.error(e);
            Lib.logException('fs get html fialed:  ', e)
            throw(e)
        }
    }


    static async fetchUserList(ctx){
        if(adminInterceptor(ctx)) return 
        try{
            const result = await UserDAO.getUserListWithSubject();
            let sResult = [];
            result.map((user)=>{
                sResult.push({
                    name:user.name,
                    id:user.id,
                    password:user.password,
                    subjectList:user.subjects
                })
            })
            ctx.body={
                code:"200",
                data:sResult
            }
        }catch(e){
            console.log(e)
            ctx.body={
                code:"204",
                data:{
                    success:false,
                    msg:e
                }
            }
            throw(e)
        }
        
    }

    //read html file
    static async getHTML (histories, subjectID) {
        let result = [];
        histories.map((item)=>{
            let contentText = '';
            try{
                if(!item.content){
                    contentText = fs.readFileSync(path.join(STATIC_PATH, subjectID.toString(), 'index.html'),'utf-8');
                } else {
                    contentText = fs.readFileSync(path.join(STATIC_PATH, subjectID.toString(), item.content),'utf-8');
                }
            }catch(e){
                console.error(e);
                Lib.logException('fs get html fialed:  ', e)
                throw(e)
            }
            result.push(
                {
                    tag:item.tag,
                    content: contentText,
                    time:item.createdAt,
                    userName:item.user.name
                }
            )
        });
        return result;
    }

    //set html file
    static async saveHTML(content, subjectID, tp){
        let htmlName = 'index';
        let dir = subjectID.toString();
        try{
            //写入磁盘
            if(!tp){
                // 新建专题
                htmlName = 'index.html';
                
                let destPath = path.join(STATIC_PATH, dir);
                
                if(!fs.existsSync(destPath)){
                    fs.mkdirSync(destPath);
                }

                fs.writeFileSync(path.join(destPath, htmlName), content);
                return dir;
            } else {
                // 编辑专题
                let destPath = path.join(STATIC_PATH, dir);
                
                if(!fs.existsSync(destPath)){
                    fs.mkdirSync(destPath);
                }

                // rename index
                htmlName += (Date.parse(new Date())/1000).toString() +　'.html';
                fs.renameSync(path.join(destPath, 'index.html'),
                                path.join(destPath, htmlName));
                
                fs.writeFileSync(path.join(destPath, 'index.html'), content);
                
                return htmlName;
            }
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
