// server.js

const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4300;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/login', (req, res) => {
    res.redirect(`https://discord.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}&response_type=code&scope=identify`);
});

app.get('/callback', async (req, res) => {
    try {
      const code = req.query.code;
      const data = {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: process.env.REDIRECT_URI
      };
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
      };
      const auth = {
        username: process.env.CLIENT_ID,
        password: process.env.CLIENT_SECRET
      };
      const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', data, {
        headers: headers,
        auth: auth
      });
  
      const accessToken = tokenResponse.data.access_token;
      const userResponse = await axios.get('https://discord.com/api/users/@me', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
  
      const userData = userResponse.data;
      res.send(`Hello, ${userData.username}#${userData.discriminator}!`);
    } catch (error) {
      console.error('An error occurred in the callback route:', error);
      res.status(500).send('An error occurred. Please try again later.');
    }
  });
  
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});