const router = require('express').Router();
const login = require('../dbtest'); 

router.route('/').post( (req, res) => {
    //TODO: validate input
    //TODO: create response
    let username = req.body.username;
    let password = req.body.password;
    let result = login(username, password).then(console.log).catch(console.dir);
    res.end();
});


module.exports = router;