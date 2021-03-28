const router = require('express').Router();

router.route('/').get((req, res) =>{
    //TODO: Connect to mongodb respond with content
});

router.route('/add').post((req, res) => {
    //TODO: Connect to mongodb and add the content
});

module.exports = router;