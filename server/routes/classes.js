const router = require('express').Router();
const {ObjectId} = require('mongodb');
const util = require('util')
const {createLesson, getUserinfo, createAssignment, deleteLesson, updateLesson} = require('../server'); 

router.route('/:id').get((req, res) =>{
    let id = req.params.id;

    getUserinfo(id).then(user =>{
        res.status(200).send(user.class).end();
    })
});

router.route('/').post((req, res) => {
    let teacherId = ObjectId.createFromHexString(req.body.id);
    let date = new Date(req.body.date);
    let startTime = req.body.startTime.split(":");
    let endTime = req.body.endTime.split(":");
    let className = req.body.class;
    let subject = req.body.subject;
    let classDescription = req.body.classDescription;
    let assignmentDescription = req.body.assignmentDescription;
    let assignmentToggle = req.body.assignmentToggle;
    let dueDate = new Date(req.body.dueDate);
    let dueTime = req.body.dueTime.split(":");;
    let files = req.body.files;
    let classFileId = null;
    let assignmentFileId = null;
    startTime = new Date(date.setHours(startTime[0], startTime[1]))
    endTime = new Date(date.setHours(endTime[0], endTime[1]))
    dueDate = new Date(dueDate.setHours(dueTime[0], dueTime[1]))
    /* If we got any information about files, we need to check if the 
    fileId is valid and then if it is for a lecture or for an assignment */
    if(files){
        files.forEach(file => {
            if(ObjectId.isValid(file.fileId)){
                file.fileId = ObjectId.createFromHexString(file.fileId);
                if(file.fileFor === "classFile"){
                    classFileId = file.fileId
                } else {
                    assignmentFileId = file.fileId
                }
            } else {
                /* Most likely, the request did not send a fileId, for this creation (either lesson or assignment)
                meaning there is no file associated with the assignment */
                file.fileId = null;
            }
        });
    }
    getUserinfo(teacherId).then(user =>{
        if(user.role === "teacher"){
            createLesson(teacherId, className, subject, startTime, endTime, classDescription, classFileId, 1, 0)
            .then( result => {
                if(assignmentToggle){
                    createAssignment(teacherId, result.id, subject, assignmentDescription, className, dueDate, assignmentFileId)
                    .then(result =>{
                        res.status(200).json(result);
                        res.end();
                    })
                } else{
                    res.status(200).json(result);
                    res.end();
                }
            })
            .catch(error =>{
                res.status(400).send({error: error.toString()});;
                res.end();
            })
        } else {
            res.status(401).send(new Error("User is not a teacher"));
            res.end();
        }
    }).catch(error =>{
        res.status(400).send({error: error.toString()});
        res.end()
    })
});

router.route('/:id').delete((req, res) => {
    deleteLesson(req.params.id).then(result =>{
        res.status(200).send(result.toString()).end();
    }).catch(reason =>{
        res.status(404).send(reason.toString()).end();
    })
})

router.route('/:id').patch((req, res) => {
    let changes = {}
    if(req.body.classDescription){
        changes.description = req.body.classDescription
    }
    if(req.body.startTime){
        changes.startTime = new Date(req.body.startTime)
    }
    if(req.body.endTime){
        changes.endTime = new Date(req.body.endTime)
    }

    updateLesson(req.params.id, changes).then(result =>{
        res.status(200).send(result.toString()).end();
    }).catch(reason =>{
        res.status(404).send(reason.toString()).end();
    })
})

module.exports = router;