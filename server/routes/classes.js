const router = require('express').Router();
const {ObjectId} = require('mongodb');
const {createLesson, getUserinfo, createAssignment} = require('../server'); 

router.route('/:id').get((req, res) =>{
    let id = req.params.id;

    getUserinfo(id).then(user =>{
        res.status(200).send(user.class).end();
    })
});

router.route('/').post((req, res) => {
    let id = ObjectId.createFromHexString(req.body.id);
    let date = new Date(req.body.date);
    let startTime = req.body.startTime.split(":");
    let endTime = req.body.endTime.split(":");
    let className = req.body.class;
    let subject = req.body.subject;
    let classDescription = req.body.classDescription;
    let assignmentDescription = req.body.assignmentDescription;
    let assignmentToggle = req.body.assignmentToggle;
    let dueDate = req.body.dueDate;
    let fileId = req.body.fileId;
    startTime = new Date(date.setHours(startTime[0], startTime[1]))
    endTime = new Date(date.setHours(endTime[0], endTime[1]))

    getUserinfo(id).then(user =>{
        if(user.role === "teacher"){
            createLesson(id, className, subject, startTime, endTime, classDescription, 1, 0)
            .then( result => {
                if(assignmentToggle){
                    if(ObjectId.isValid(fileId)){
                        fileId = ObjectId.createFromHexString(fileId);
                    } else {
                        /* Most likely, the request did not send a fileId, 
                        meaning there is no file associated with the assignemtn */
                        fileId = null;
                    }
                    createAssignment(id, result.id, className, subject, assignmentDescription, dueDate, fileId)
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

module.exports = router;