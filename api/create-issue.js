const axios = require('axios');
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');  // Allow all origins
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    const { repo, title, body } = req.body;

    try {
        const response = await fetch(`https://api.github.com/repos/${repo}/issues`, {
            method: 'POST',
            headers: {
                Authorization: `token ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, body })
        });

        const data = await response.json();
        res.status(200).json({ html_url: data.html_url });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create issue' });
    }
};