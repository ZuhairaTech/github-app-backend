const axios = require('axios');
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');  // Allow all origins
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    try {
        const appId = process.env.APP_ID;
        const privateKey = process.env.PRIVATE_KEY.replace(/\\n/g, '\n');
        const installationId = process.env.INSTALLATION_ID;

        const now = Math.floor(Date.now() / 1000);
        const payload = {
            iat: now - 60,
            exp: now + (10 * 60),
            iss: appId
        };

        const token = jwt.sign(payload, privateKey, { algorithm: 'RS256' });

        const tokenResponse = await axios.post(
            `https://api.github.com/app/installations/${installationId}/access_tokens`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/vnd.github+json'
                }
            }
        );

        const accessToken = tokenResponse.data.token;

        res.json({ accessToken });
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).send('Error generating token.');
    }
};
