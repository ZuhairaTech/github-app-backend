const fetch = require('node-fetch');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');  // Allow all origins
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    const code = req.query.code;

    // Exchange code for access token
    const response = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
            client_id: 'Ov23liUSn6KNi2EZZGLh',
            client_secret: 'eff364b60b9470d6cf49873c7a238bc8fc4acd77',
            code
        })
    });

    const data = await response.json();

    if (data.access_token) {
        // Redirect back to frontend with the token (you can improve this later)
        res.redirect(`https://github-app-frontend.vercel.app/?token=${data.access_token}`);
    } else {
        res.status(400).send('Authentication failed.');
    }
};
