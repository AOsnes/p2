const {ObjectId} = require('mongodb');
const router = require('express').Router();
const {getFile, getFilename} = require('../server');


router.route('/:id').get((req, res) => {
    let fileId = ObjectId(req.params.id);
    getFilename(fileId)
    .then((fileName) => {
        getFile(fileId, fileName)
        .then( path => {
            res.status(200).download(path, fileName, error => {
                if(error){
                    console.log(error)
                }
                res.end();
            });
        })
        .catch(error => {
            res.status(400).send({error: error.toString()});
            res.end();
        });
    })
    .catch(console.dir);
});

module.exports = router;