const express = require('express')
const PORT = process.env.PORT || 3000;


const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

const path = require('path');
const app = express();

// Middleware
app.use(bodyParser.json()); // Parse incoming requests with JSON payloads
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded payloads

app.use(express.static(path.join(__dirname, 'views')));

app.get('/home', (req, res) => {
    res.send('Welcome to the Expense Tracker App');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});