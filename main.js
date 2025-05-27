const express = require('express');
const request = require('request'); // npm install request
const cors = require('cors');
const app = express();
app.use(cors());

app.get('/proxy', (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).send('Missing url parameter');
    request(
        { url, encoding: null, followAllRedirects: true },
        (error, response, body) => {
            if (error) return res.status(500).send('Error fetching remote content');
            // Set headers from remote site, but you can filter some for security
            for (let key in response.headers) {
                res.setHeader(key, response.headers[key]);
            }
            res.status(response.statusCode).send(body);
        }
    );
});

app.listen(3000, () => {
    console.log('Proxy listening on port 3000');
});
