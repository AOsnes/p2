const router = require('express').Router();
const login = require('../dbtest');

router.route('/').post( (req, res) => {
    //console.dir(req.body);
    let result = login("test", "test").then(console.log).catch(console.dir);
    res.end();
});


module.exports = router;