const router = require('express').Router();
const {getUserinfo, getAssignments, turnInAssignment, getTurnedInAssignments} = require('../server');

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

router.route('/turnIn').post((req, res) =>{
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

router.route('/turnedIn/:id/:assignmentId').get((req, res) =>{
    getTurnedInAssignments(req.params.id, req.params.assignmentId).then(result =>{
        res.status(200).json(result).end();
    })
})

module.exports = router;