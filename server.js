// Inspired by:
// https://blog.javascripting.com/2015/01/17/dont-hassle-with-cors/

let express = require('express');
let request = require('request');
let URI = require('urijs');
let cors = require('cors');

const SERVER_HOST = 'https://www.quandl.com/api/v3/datatables/WIKI/PRICES.json';
const API_KEY = 'WCQgfrbePtWCWzoooSjz';

// allow cors from specific origin
let corsOptions = {
    origin: [
        /https?:\/\/localhost.*/, // localhost
        /https?:\/\/andiwinata\.github\.*/ // github pages
    ],
    optionSuccessStatus: 200
}

let app = express();
app.use(cors(corsOptions));

app.use('/', (req, res, next) => {
    let sourceUri = new URI(req.url);
    // get only parameter from the url
    let search = sourceUri.search();

    // construct target URI
    let targetUri = new URI(`${SERVER_HOST}${search}`)
        .normalizeProtocol()
        .normalizeHostname()
        .normalizeQuery();

    // check if it doesn't have API key
    if (!targetUri.hasQuery('api_key')) {
        // append default api key
        targetUri.setQuery('api_key', API_KEY);
    }

    // do forwarding
    req.pipe(request(targetUri.toString())).pipe(res);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);
console.log(`Server is now running at port: ${PORT}!`);