const router = require('express').Router();
const fs = require('fs')
const {saveFile, updateAssignment} = require('../server'); 
router.route('/').post( (req, res) =>  {
    let fstream;
    res.status(200);
    req.pipe(req.busboy);
    req.busboy.on('file', (fieldname, file, filename) =>{
        console.log("Uploading:" + filename);
        fstream = fs.createWriteStream(__dirname + '/../tmp/' + filename);
        
        file.pipe(fstream);
        fstream.on('close', () =>{
            console.log(`Uploading file: ${filename} to DB now`);
            saveFile(filename, () =>{
                console.log("Done POG")
            })
        })
    })
});

module.exports = router;
