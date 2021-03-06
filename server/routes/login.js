const router = require('express').Router();
const {authenticate} = require('../server'); 

router.route('/').post( (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    authenticate(username, password)
    .then( result => {
        res.status(200).json({id: result._id, role: result.role, name: result.name});
        res.end();
    })
    .catch( error => {
        res.status(400).send({error: error.toString()});
        res.end();
    });
});

module.exports = router;