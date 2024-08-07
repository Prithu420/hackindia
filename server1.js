const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require("cors");
require('dotenv').config();

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

app.post('/api/generate', async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).send('Error: Prompt is required');
    }

    try {
        const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
            prompt: prompt,
            max_tokens: 150,
            temperature: 0.7
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error occurred:', error); // Added error logging
        if (error.response) {
            res.status(error.response.status).send('Error: ' + JSON.stringify(error.response.data, null, 2)); // Improved error message
        } else if (error.request) {
            res.status(500).send('Error: No response from OpenAI API');
        } else {
            res.status(500).send('Error: ' + error.message);
        }
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
