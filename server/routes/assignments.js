const router = require('express').Router();
const {getUserinfo, getAssignments, turnInAssignment, getTurnedInAssignments, updateAssignment, deleteAssignment} = require('../server');

router.route('/:id/:date').get((req, res) =>{
    let id = req.params.id;
    let date = new Date(req.params.date);
    getUserinfo(id).then( user =>{
        getAssignments(user, date).then(assignments =>{
            res.status(200).json(assignments);
            res.end();
        })
        .catch(error => {
            res.status(404).send({error: error.toString()});
            res.end();
        });
    }).catch(error => {
        res.status(400).send({error: error.toString()});
        res.end();
    });
});

router.route('/').post((req, res) =>{
    let assignmentId = req.body.assignmentId;
    let studentId = req.body.studentId;
    let fileId = req.body.fileId;

    turnInAssignment(assignmentId, studentId, fileId).then(result =>{
        res.status(200).send(result.toString());
        res.end();
    }).catch(reason => {
        res.status(400).send(reason.toString());
        res.end();
    })
})

/* assignmentId can only be undefined if id is that of a student. DO NOT
use this route on a teachers id without any assignmentId specified */
router.route('/:id/:assignmentId?/turnedIn').get((req, res) =>{
    let assignmentId = req.params.assignmentId
    if(assignmentId === "0"){
        assignmentId = undefined
    }    
    getTurnedInAssignments(req.params.id, assignmentId).then(result =>{
        res.status(200).json(result).end();
    })
})

router.route('/:id').delete((req, res) => {
    deleteAssignment(req.params.id).then(result =>{
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
    if(req.body.dueTime){
        changes.dueDate = new Date(req.body.dueTime)
    }

    updateAssignment(req.params.id, changes).then(result =>{
        res.status(200).send(result.toString()).end();
    }).catch(reason =>{
        res.status(404).send(reason.toString()).end();
    })
})

module.exports = router;