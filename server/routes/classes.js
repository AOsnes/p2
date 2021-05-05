const router = require('express').Router();
const {createLesson, getUserinfo} = require('../server'); 
router.route('/').get((req, res) =>{
    //TODO: Connect to mongodb respond with content
});

router.route('/').post((req, res) => {
    let id = req.body.id;
    let date = new Date(req.body.date);
    let startTime = req.body.startTime.split(":");
    let endTime = req.body.endTime.split(":");
    let className = req.body.class;
    let subject = req.body.subject;
    let description = req.body.description;

    startTime = new Date(date.setHours(startTime[0], startTime[1]))
    endTime = new Date(date.setHours(endTime[0], endTime[1]))
    getUserinfo(id).then(user =>{
        if(user.role === "teacher"){
            createLesson(id, className, subject, startTime, endTime, description, 1, 0)
            .then( result => {
                res.status(200).send(result);
                res.end();
            })
            .catch(error =>{
                res.status(400).send({error: error.toString()});;
                res.end();
            })
        } else {
            res.status(401).send("User is not a teacher");
            res.end();
        }
    }).catch(error =>{
        res.status(400).send({error: error.toString()});
        res.end()
    })
    
});

module.exports = router;