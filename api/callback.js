const axios = require('axios');

module.exports = async (req, res) => {
    try {
        const code = req.query.code;

        if (!code) {
            return res.status(400).json({ error: 'No code provided' });
        }

        // ⚙️ Make sure these env variables are set in Vercel
        const clientId = process.env.CLIENT_ID;
        const clientSecret = process.env.CLIENT_SECRET;

        // Exchange the code for an access token
        const tokenResponse = await axios.post(
            'https://github.com/login/oauth/access_token',
            {
                client_id: clientId,
                client_secret: clientSecret,
                code: code
            },
            { headers: { Accept: 'application/json' } }
        );

        const accessToken = tokenResponse.data.access_token;

        if (!accessToken) {
            return res.status(500).json({ error: 'Failed to retrieve access token' });
        }

        // Redirect to the frontend with the token in the URL
        res.redirect(`https://github-app-backend.vercel.app/?token=${accessToken}`);

    } catch (error) {
        console.error('Error in callback:', error.response?.data || error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
