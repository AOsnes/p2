const router = require('express').Router();
const {ObjectId} = require('mongodb');
const {updateTurnedInAssignment} = require('../server');

router.route('/').patch((req, res) =>{
    let promises = [];
    for (const index in req.body) {
        let changes = {};
        if(req.body[index].hasOwnProperty("reaction")){
            changes.reaction = parseInt(req.body[index].reaction);
        }
        if(req.body[index].hasOwnProperty("feedbackFileId")){
            changes.feedbackFileId = ObjectId(req.body[index].feedbackFileId);
        }
        promises.push(
            updateTurnedInAssignment(req.body[index].assignmentId, changes).then(result =>{
                return result;
            })
        )
    }
    Promise.all(promises).then(result =>{
        res.status(200).send(result).end()
    }).catch(reason =>{
        res.status(400).send(reason.toString()).end()
    })
})

module.exports = router;