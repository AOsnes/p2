const express = require('express');
const app = express();

//TODO: lav dotenv fil
const port = process.env.PORT || 5000

let logger = (req, res, next) => {
    console.log(`${req.protocol}://${req.get('host')}${req.originalUrl} requested at: ${req.requestTime} (DATE object)`);
    next();
}

let requestTime = (req, res, next) => {
    req.requestTime = Date.now();
    next();
}

app.use(requestTime);
app.use(logger);

app.get('/', (req, res) =>{
    res.send('Hello world!')
})

app.listen(port, () =>{
    console.log(`Server is listening on port ${port}`)
})