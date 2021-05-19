const {ObjectId} = require('mongodb');
const router = require('express').Router();
const {getUserinfo, getSchedule, getFile} = require('../server');

router.route('/:id/:date/:days').get((req, res) =>{
    let id = req.params.id;
    let days = req.params.days
    let date = new Date(req.params.date);

    getUserinfo(id).then( user =>{
        getSchedule(user, date, days).then( schedule =>{
            res.status(200).json(schedule);
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

router.route('/:id').get((req, res) => {
    let fileId = ObjectId(req.params.id);
    getFile(fileId).then( path => {
        res.status(200).json(path);
        res.end();
    }).catch(error => {
        res.status(400).send({error: error.toString()});
        res.end();
    })
})

module.exports = router;