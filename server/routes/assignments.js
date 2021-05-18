const router = require('express').Router();
const {getUserinfo, getAssignments} = require('../server');

router.route('/:id/:date').get((req, res) =>{
    let id = req.params.id;
    let date = new Date(req.params.date);

    getUserinfo(id).then( user =>{
        getAssignments(user, date).then( Assignments =>{
            res.status(200).json(Assignments);
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

router.route('/').post( (req, res) =>{
})

module.exports = router;