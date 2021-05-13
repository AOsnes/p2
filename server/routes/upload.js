const router = require('express').Router();
const upload = require('express-fileupload');

router.route('/upload').post( (req, res) =>  {
    if (req.files) {
        console.log(req.files);
        let file = req.files.file;
        let filename = file.name;
        console.log(filename);
        file.mv('../tmp', filename, (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log("Success")
            }
        });
    }
});

module.exports = router;
