const axios = require('axios');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const response = await axios.get('https://api.github.com/user/repos', {
            headers: {
                Authorization: `token ${token}`,
                Accept: 'application/vnd.github+json'
            }
        });

        res.json({ repositories: response.data });
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).send('Error fetching repositories.');
    }
};
