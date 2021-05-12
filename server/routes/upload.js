const router = require('express').Router();
const upload = require('express-fileupload');

router.route('/upload').post( (req, res) =>  {
    if (req.files) {
        console.log(req.files);
    }
});

module.exports = router;
