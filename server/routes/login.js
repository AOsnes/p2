const router = require('express').Router();
const authenticate = require('../server'); 

router.route('/').post( (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    authenticate(username, password)
    .then( result => {
        //TODO:send which type the user is e.g
        //res.send(result.type)
        res.status(200).json({id: result.id});
        res.end();
    })
    .catch( error => {
        //TODO: Af en eller anden grund smider den ikke error over i response, fix.
        res.status(200).send(error);
        res.end();
    });
});

module.exports = router;