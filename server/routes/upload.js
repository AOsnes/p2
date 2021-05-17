const router = require('express').Router();
const fs = require('fs')
const {saveFile} = require('../server'); 
router.route('/').post( (req, res) =>  {
    let fstream;
    
    req.pipe(req.busboy);
    req.busboy.on('file', (fieldname, file, filename) =>{
        fstream = fs.createWriteStream(__dirname + '/../tmp/' + filename);
        res.status(202)
        file.pipe(fstream);
        fstream.on('close', () =>{
            console.log(`Uploading file: ${filename} to DB now`);
            saveFile(filename).then(fileId =>{
                res.status(200).send(fileId);
                res.end()
            }).catch(error =>{
                res.status(400).send(error);
                res.end();
            })
        })
    })
});

module.exports = router;
