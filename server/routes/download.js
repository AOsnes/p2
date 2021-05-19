const {ObjectId} = require('mongodb');
const router = require('express').Router();
const {getFile} = require('../server');


router.route('/:id').get((req, res) => {
    let fileId = ObjectId(req.params.id);
    getFile(fileId).then( path => {
        res.status(200).json(path);
        res.end();
    }).catch(error => {
        res.status(400).send({error: error.toString()});
        res.end();
    })
});

module.exports = router;