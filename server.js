const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
// Setup empty JS object to act as endpoint for all routes

projectData = {};


// Start up an instance of app
const app = express()
/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
app.use(cors())
// Initialize the main project folder
app.use(express.static('website'));

app.post('/add', (req, res) => {
    const { temperature, date, feelings } = req.body

    projectData["temperature"] = temperature;
    projectData["date"] = date;
    projectData["feelings"] = feelings;
    res.status(201).send('ok')
})

app.get('/get', (req, res) => {
    res.status(200).json(projectData)
})

// Setup Server
const port = 3000;
app.listen(port, () => {
    console.log('Server is running on port ', port)
}) 