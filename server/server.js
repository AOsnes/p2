const express = require('express');
const app = express();

//TODO: Fix så db connection skal laves én gang 
//https://expressjs.com/en/guide/database-integration.html

//TODO: lav dotenv fil til process variabler
const port = process.env.PORT || 5000

let logger = (req, res, next) => {
    console.log(`GOT: ${req.protocol}://${req.get('host')}${req.originalUrl} TIME: ${req.requestTime}`);
    next();
}

let requestTime = (req, res, next) => {
    req.requestTime = Date.now();
    next();
}

app.use(requestTime);
app.use(logger);


//ROUTES
const classesRouter = require('./routes/classes');
app.use('/classes', classesRouter);

app.listen(port, () =>{
    console.log(`Server is listening on port ${port}`)
})

async function login(username, password) {
    try {
        await client.connect();
        const database = client.db('P2');
        const doc = database.collection("users");
        const result = await doc.findOne({username, password});
        if (result === null) {
            throw "Invalid username or password";
        } else {
            return {
                id: result._id,
                name: result.name,
                role: result.role,
                class: result.class
            };
        }
        //console.log(result);
        //console.log(result._id, result.role, result.class[0]);


    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }

}
















