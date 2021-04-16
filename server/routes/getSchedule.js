const router = require('express').Router();
const {getUserinfo, getSchedule} = require('../server');

router.route('/:id/:date/:days').get((req, res) =>{
    let id = req.params.id;
    let days = req.params.days
    let datestring = req.params.date.split(".");
    let date = new Date(datestring[2], datestring[1], datestring[0]);
    getUserinfo(id).then( user =>{
        getSchedule(user, date, days).then( schedule =>{
            res.status(200).json(schedule);
            res.end();
        })
        .catch(error => {
            res.status(400).send({errpr: error.toString()});
        });
    }).catch(error => {
        res.status(404).send({error: error.toString()});
    });
});

module.exports = router;