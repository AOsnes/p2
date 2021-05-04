const router = require('express').Router();
const {createLesson} = require('../server'); 
router.route('/').get((req, res) =>{
    //TODO: Connect to mongodb respond with content
});

router.route('/').post((req, res) => {
    let id = req.body.id;
    let date = new Date(req.body.date);
    let startTime = req.body.startTime;
    let endTime = req.body.endTime;
    let className = req.body.class;
    let subject = req.body.subject;
    let description = req.body.description;

    console.log(startTime)
    date.setTime(date.getTime())
    console.log(date)
    res.end()
    /* createLesson(id, className, subject, startTime, endTime, description, 0, 0) */
});

module.exports = router;