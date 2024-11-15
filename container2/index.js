const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { parse } = require('csv-parse');
const fs = require('fs');
const port = 3001;
const FILEPATH = '../../../JEET_PV_dir/data/'

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    return res.send(' Jeet is hererereerere');
});

app.get('/jeet', (req, res) => {
    return res.send('jeet is here from container 2 hiii hiii hiii');
})



app.post('/calData', async (req, res) => {
    const { file, product } = req.body
    const sum = 0
    let errorNew = null;
    let total = 0;

    try {

        const fileData = fs.readFileSync(FILEPATH + file, { encoding: 'utf-8' })
        const rows = fileData.split(/\r?\n/)
        const headers = rows.shift().split(',')
        if (headers && headers.length !== 2 || headers[0].trim() !== 'product' || headers[1].trim() !== 'amount') {
            console.log('inside header check');
            return res.send({
                file: file,
                error: "Input file not in CSV format."
            });
        }
        const rowObjects = rows.map((row, index) => {
            const rowValues = row.split(',')
            if (rowValues.length !== 2) {
                return errorNew = {
                    file: file,
                    error: "Input file not in CSV format."
                }
            }
            if (rowValues[0].trim() === product) {
                total += parseInt(rowValues[1].trim())
            }
        })

        return res.send(errorNew ? errorNew : {
            file: req.body.file,
            sum: total.toString()
        });
    } catch (error) {

        return res.send({
            file: file,
            error: "Input file not in CSV format."
        });
    }
})

app.listen(port, '0.0.0.0', () => {
    console.log(`Example app listening at http://localhost:${port}`);
});