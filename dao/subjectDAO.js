
'use strict';

const Lib        = require('../lib/lib.js');
const ModelError = require('../models/modelerror.js');
const model  = require('../models/index.js');
const sequelize = model.sequelize;

class SubjectDAO {
    static async getSubjectList({userID,status}) {
        let subjects;
        //用户
        if(userID){
            subjects = await model.subject.findAll({
                attributes: { exclude: ['userId'] },
                where: {
                    userId: userID
                },
                include: [{
                    model:model.user,
                    attributes:['name','id']
                },{
                    model:model.history,
                    attributes:['createdAt','userId'],
                    include:[{
                        model:model.user,
                        attributes:['name']
                    }]
                }],
    
                order: [
                    ['createdAt', 'DESC'],
                    [model.history,'createdAt', 'DESC']
                ]
            })
        }else{
            // 管理员返回没有owner的list
            if(status == 1){
                subjects = await model.subject.findAll({
                    attributes: { exclude: ['userId'] },
                    where:{
                        userId:null
                    },
                    include: [{
                        model:model.user,
                        attributes:['name','id']
                    },{
                        model:model.history,
                        attributes:['createdAt','userId'],
                        include:[{
                            model:model.user,
                            attributes:['name']
                        }]
                    }],
        
                    order: [
                        ['createdAt', 'DESC'],
                        [model.history,'createdAt', 'DESC']
                    ]
                })
            }else{
                // 返回所有list
                subjects = await model.subject.findAll({
                    attributes: { exclude: ['userId'] },
                    include: [{
                        model:model.user,
                        attributes:['name','id']
                    },{
                        model:model.history,
                        attributes:['createdAt','userId'],
                        include:[{
                            model:model.user,
                            attributes:['name']
                        }]
                    }],
        
                    order: [
                        ['createdAt', 'DESC'],
                        [model.history,'createdAt', 'DESC']
                    ]
                })
            }
        }
        return subjects
    }

    // 新建专题是由管理员创建的，不应该在这里添加owner
    static async addSubject(content,tag,userID,subjectName){
        try {
            return sequelize.transaction(function (t) {
                return model.subject.create({
                    name:subjectName,
                    // userId:userID
                }, {transaction: t}).then(function (subject) {
                    return model.history.create({
                        tag:tag,
                        content:content,
                        userId:userID,
                        subjectId:subject.id
                    },{transaction:t})
                });
            }).then(function (result) {
                return result.subjectId
            }).catch((e)=>{
                console.error(e)
                return false
            })
        } catch (e) {
            console.error(e)
            Lib.logException('model.subject.addSubject', e);
            throw(e)
        }
    }

    static async addHistory(content,tag,userID,subjectID){
        try{
            await model.history.create({
                tag:tag,
                content:content,
                userId:userID,
                subjectId:subjectID
            })
            return subjectID
        }catch(e){
            console.error(e)
            Lib.logException('model.subject.addSubject', e);
            throw(e)
            return false
        }
    }

    static async getSubject(subjectID,userID){
        let subject;
        try{
            if(userID){
                subject = await model.subject.findOne({
                    attributes: { exclude: ['userId'] },
                    where: {
                        userId: userID,
                        id:subjectID
                    },
                    include: [{
                        model:model.user,
                        attributes:['name','id']
                    },{
                        model:model.history,
                        attributes:['createdAt','userId','tag','content'],
                        include:[{
                            model:model.user,
                            attributes:['name']
                        }]
                    }]
                })
            }else{
                subject = await model.subject.findOne({
                    attributes: { exclude: ['userId'] },
                    where: {
                        id:subjectID
                    },
                    include: [{
                        model:model.user,
                        attributes:['name','id']
                    },{
                        model:model.history,
                        attributes:['createdAt','userId','tag','content'],
                        include:[{
                            model:model.user,
                            attributes:['name']
                        }]
                    }]
                })
            }
            return subject;
        }catch(e){
            Lib.logException('model.subject.getSubject', e);
            console.error(e);
            throw e;
        }
    }

    static async deleteSubject(subjectID,userID){
        try{
            if(userID){
                await model.subject.destroy({
                    where: { 
                        id: subjectID,
                        userId: userID
                    }
                })
            }else{
                await model.subject.destroy({
                    where: { 
                        id: subjectID
                    }
                })
            }
        }catch(e){
            console.error(e);
            Lib.logException('model.subject.deleteSubject', e);
            throw(e)
        }
    }


    //添加一个公司的账号，同时更新专题的owner
    static async addCompany(name,password,subjectList){
        try {
            return sequelize.transaction(function (t) {
                return model.user.create({
                    name:name,
                    password:password,
                    role:1
                }, {transaction: t}).then(function (user) {
                    SubjectDAO.updateCompany(user.id,subjectList)
                });
            }).then(function (result) {
                return true
            }).catch((e)=>{
                console.error(e)
                Lib.logException('model.subject.addCompany', e);
                return false
            })
        } catch (e) {
            console.error(e)
            Lib.logException('model.subject.addCompany or updateCompany', e);
            throw(e)
        }
    }

    //其实是更新专题的owner
    //找不到合适的名字了
    static async updateCompany(id,subjectList){
        // filtedList = subjectList.filter((subject)=>{
        //     return 
        // })
        try {
            subjectList.map(async (subjectID)=>{
                try{
                    await model.subject.update({
                        userId:id
                    },{where: {
                        id: subjectID
                    }})
                }catch(e){
                    console.error(e)
                    Lib.logException('model.subject.map upadate', e);
                    throw(e)
                }
                
            })
            return true
        } catch (e) {
            console.error(e)
            Lib.logException('model.subject.updateCompany', e);
            throw(e)
            return false
        }
    }
}

/**
 * 
    var user = yield User.find(1);
    user.ip = '10.0.0.1';
    user.isNpmUser = false;
    yield user.save(['ip', 'isNpmUser']);

    var user = yield User.find(2);
    user.isNpmUser = true;
    yield user.save(['isNpmUser']);
 * 
 */


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

module.exports = SubjectDAO;
