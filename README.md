## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

`npm test a` To run the full test environment 

`npm test -- /server` To run server tests (optionnal `a`)

`npm test -- /src` To run frontend tests (optionnal `a`)

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

## The server
To run the server run `node server.js` in the server folder. Make sure to include a uri to a mongoDB server either in a .env file or inserted in the following line in the server.js file.
```JavaScript
const uri = process.env.URI
```
## Available flowcharts
The following is a flowchart of how some of the endpoints function
![endpoints diagram](https://user-images.githubusercontent.com/24461644/119781662-91483880-becb-11eb-979f-3c37a70787ad.png)
