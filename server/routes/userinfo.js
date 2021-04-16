const router = require('express').Router();
const {getUserinfo} = require('../server');

router.route('/:id').get( (req, res) => {
    let id = req.params.id
    getUserinfo(id).then( result => {
        res.status(200).json({
            id: result._id,
            name: result.name,
            role: result.role,
        });
        res.end();
    })
    .catch( error => {
        res.status(200).send({error: error.toString()});
        res.end();
    })
})

/* route for when we want to update the user profile */
router.route('/').patch( (req, res) =>{

})

module.exports = router;