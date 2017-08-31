
'use strict';

const Lib        = require('../lib/lib.js');
const ModelError = require('../models/modelerror.js');
const model  = require('../models/index.js');
const sequelize = model.sequelize;

class SubjectDAO {
    static async getSubjectList(userID) {
        let subjects;
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
        return subjects
    }

    static async addSubject(content,tag,userID){
        try {
            return sequelize.transaction(function (t) {
                return model.subject.create({
                    name:subjectName
                }, {transaction: t}).then(function (subject) {
                    this.addHistory(content,tag,userID,subjectID)
                });
            }).then(function (result) {
                return true
            }).catch(()=>{
                return false
            })
        } catch (error) {
            return false
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
        }catch(e){

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
