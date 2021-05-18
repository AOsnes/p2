const router = require('express').Router();
const fs = require('fs')
const {saveFile} = require('../server'); 
router.route('/').post( (req, res) =>  {
    let fileCount = 0;
    let files = []; /* holds Ids for files */
    req.pipe(req.busboy);
    req.busboy.on('field', (fieldname, value) =>{
        if(fieldname === "fileCount"){
            fileCount = parseInt(value);
            console.log(fileCount)
        }
    })
    req.busboy.on('file', (fieldname, file, filename) =>{
        console.log(`Got file: ${filename}`)
        file.pipe(fs.createWriteStream(__dirname + '/../tmp/' + filename))
        file.on('close', () =>{
            console.log(`Uploading: ${filename} to DB now`);
            saveFile(filename).then(fileId =>{
                let fileInfo = {
                    fileFor: fieldname,
                    fileId: fileId,
                }
                files.push(fileInfo)
                console.log(`Done uploading: ${filename} total files uploaded: ${files.length}`)
                if(files.length === fileCount){
                    res.status(200).json(files).end();
                }
            }).catch(error =>{
                console.log(error)
            })
        })
    })
    req.busboy.on('finish', () => {
        
    })
});

module.exports = router;
