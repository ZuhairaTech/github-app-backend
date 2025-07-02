const path = require('path');
const fs = require('fs');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');  // Allow all origins
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Get the requested file path from the URL
    const filePath = path.join(__dirname, '../public', req.query.file);

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.status(404).send('File not found.');
            return;
        }

        // Basic content type detection
        let contentType = 'text/plain';
        if (filePath.endsWith('.html')) contentType = 'text/html';
        else if (filePath.endsWith('.css')) contentType = 'text/css';
        else if (filePath.endsWith('.js')) contentType = 'application/javascript';
        else if (filePath.endsWith('.png')) contentType = 'image/png';
        else if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) contentType = 'image/jpeg';

        res.setHeader('Content-Type', contentType);
        res.status(200).send(data);
    });
};
