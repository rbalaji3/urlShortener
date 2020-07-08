const express = require('express');
const cors = require('express');
const morgan = require('express');
const helmet = require('express');
const yup = require('yup');
const monk = require('monk');
const { nanoid } = require('nanoid')

require('dotenv').config();

var db = monk('localhost:27017');
const urls = db.get('urls');
urls.createIndex({ alias: 1 }, { unique: true });


require('dotenv').config();
const app = express();
app.use(helmet());
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(express.static('./public'));


const scheme = yup.object().shape({
    alias: yup.string().trim().matches(/^[\w\-]+$/i),
    url: yup.string().trim().url().required(),
});

//Create a short url 
app.post('/url', async (req, res, next) => {
    var {alias, url} = req.body; // transform req into appropriate format
    try {
        await scheme.validate({ //otherwise wait for our scheme to validate the alias and the url
            alias, 
            url
        })
        if (!alias) { // if no given alias (id) then create our won 
            // model.id = nanoid() //=> "V1StGXR8_Z5jdHi6B-myT"
            alias = nanoid(5);
        }
        else {
            // if user inputs an alias, check it is not already in use
            const existing = await urls.findOne({alias});
            if (existing) {
                throw new Error('Alias in use ');
            }
        }
        alias = alias.toLowerCase()
        // make a client secret for access
        const client_secret = nanoid(10).toLowerCase()
        const newURL = {
            url,
            alias,
        };
        const created = await urls.insert(newURL);
        res.json(created)
    }
    catch(error) {

        next(error);
    }

});

app.use((error, req, res, next) => {
    if (error.status) {
        res.status(error.status)
    }
    else {
        res.status(500)
    }
    res.json({
        message: error.message,
        stack: process.env.NODE_ENV == 'production' ? 'temp' : error.stack,
    })
});

app.get('/:id', async (req, res, next) => {
    // TODO: redirect to url via an id given an existing id
    const {id: alias} = req.params;

    try {
        const url = await urls.findOne({alias });
        if (url) {
            res.redirect(url.url)
        }
        res.redirect(`/?error=${alias} not found`)
    }
    catch(error) {
        res.redirect(`/?error=Link not found`);
    }
});


app.get('/url/:id', (req, res) => {
    // TODO: get a short url by id from the original url 
});


const port = 1337;
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);

})