const express = require('express');
const fs = require('fs');
const app = express();
const bodyParser = require('body-parser');
const { default: axios } = require('axios');
const FILEPATH = '../../../JEET_PV_dir/data/'

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    res.send('Showing the video of the project.');
})

app.get('/home', async (req, res) => {
    const data = await axios('http://localhost:3001/jeet', {
        method: 'GET'
    })
    return res.send(data.data);
})

app.post('/store-file', (req, res) => {
    if (!req.body.file || !req.body.data) {
        return res.send({
            "file": null,
            "error": 'Invalid JSON input.'
        });
    }

    // if (!req.body.data.includes('amount') && !req.body.data.includes('product')) {
    //     return res.send({
    //         "file": req.body.file,
    //         "error": 'Invalid JSON input.'
    //     })
    // }

    fs.writeFile(FILEPATH + req.body.file, req.body.data, (err) => {
        if (err) {
            return res.send({
                "file": req.body.file,
                "error": 'Invalid JSON input.'
            });
        }
        return res.send({
            "file": req.body.file,
            "message": "Success."
        });
    })


})

app.post('/calculate', async (req, res) => {
    if (!req.body.file) {
        return res.send({
            "file": null,
            "error": 'Invalid JSON input.'
        });
    }

    if (req.body.file) {
        console.log('inside file check file name is ', req.body.file);
        console.log('inside file check file path is ', FILEPATH + req.body.file);
        if (!fs.existsSync(FILEPATH + req.body.file)) {
            console.log('NOT FOUND', FILEPATH + req.body.file);
            return res.send({
                "file": req.body.file,
                "error": 'File not found.'
            })
        }
    }

    try {
        const response = await axios('http://localhost:3001/calData', {
            method: 'POST',
            data: { file: req.body.file, product: req.body.product }
        });
        return res.send(response.data)

    } catch (error) {
        return res.send({
            "file": req.body.file,
            "error": 'Invalid JSON input.'
        });
    }

})

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
})
