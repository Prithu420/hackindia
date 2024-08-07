const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require("cors");
require('dotenv').config(); // For loading environment variables

 const app = express();
 const port = 3000;

 app.use(bodyParser.json());
 app.use(cors());
 app.use(express.static('public')); // Serve static files from the 'public' directory

  app.post('/api/generate', async (req, res) => {
  const { prompt } = req.body;
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
        res.status(500).send('Error: ' + error.message);
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
