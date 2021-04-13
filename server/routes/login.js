const router = require('express').Router();
const authenticate = require('../server'); 

router.route('/').post( (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    authenticate(username, password)
    .then( result => {
        res.status(200).json({id: result.id, role: result.role});
        res.end();
    })
    .catch( error => {
        //TODO: Af en eller anden grund smider den ikke error over i response, fix.
        res.status(200).send(error);
        res.end();
    });
});

module.exports = router;