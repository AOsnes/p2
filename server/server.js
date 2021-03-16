const express = require('express');
const app = express();

//TODO: lav dotenv fil
const port = process.env.PORT || 5000

app.get('/', (req, res) =>{
    res.send('Hello world!')
})

app.listen(port, () =>{
    console.log(`Server is listening on port ${port}`)
})