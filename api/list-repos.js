const axios = require('axios');
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
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

        const repoResponse = await axios.get(
            'https://api.github.com/installation/repositories',
            {
                headers: {
                    Authorization: `token ${accessToken}`,
                    Accept: 'application/vnd.github+json'
                }
            }
        );

        res.json(repoResponse.data);
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).send('Error fetching repositories.');
    }
};
