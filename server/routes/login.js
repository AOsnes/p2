const router = require('express').Router();
const authenticate = require('../server'); 

router.route('/').post( (req, res) => {
    //TODO: validate input
    //TODO: create response
    let username = req.body.username;
    let password = req.body.password;
    let result = authenticate(username, password).then(console.log).catch(console.dir);
    
    if (result != null){
        //TODO: login the user
    }
    res.redirect('/');
});


module.exports = router;