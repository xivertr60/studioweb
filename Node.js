// Instala axios: npm install express axios cors
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: userMessage }]
      },
      {
        headers: {
          'Authorization': `Bearer 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`,
          'Content-Type': 'application/json'
        }
      }
    );
    res.json({ reply: response.data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: 'Error al comunicarse con OpenAI.' });
  }
});

app.listen(3000, () => console.log('Servidor listo en puerto 3000'));
