const express = require('express');
const app = express();

/* Middleware */
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// Initialise the main project folder
app.use(express.static('website'));

const projectData = [];

app.get('/all', getData);

function getData(req, res) {
    res.send(projectData);
    console.log(projectData);
};

app.post('/addEntry', (req, res) => {
    const entry = req.body;
    projectData.push(entry);
    res.json(projectData);
});

// Spin up the server
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`server is running on localhost: ${port}`));