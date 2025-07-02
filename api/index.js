const path = require('path');
const fs = require('fs');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');  // Allow all origins
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    const filePath = path.join(__dirname, '../public/index.html');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error loading page.');
            return;
        }
        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(data);
    });
};
 