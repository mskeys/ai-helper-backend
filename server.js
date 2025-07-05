const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ✅ OpenRouter API Key + baseURL
const openai = new OpenAI({
  apiKey: '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',
  baseURL: 'https://openrouter.ai/api/v1',
});

app.post('/api/assignment', async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log("👉 Prompt received:", prompt);

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const completion = await openai.chat.completions.create({
      model: 'openai/gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500, // ✅ Limit to avoid error 402
    });

    console.log("✅ Response received from OpenRouter");

    const reply = completion.choices[0].message.content;
    res.json({ reply });

  } catch (error) {
    console.error('❌ OpenRouter API error:', error);
    res.status(500).json({ error: 'Something went wrong with OpenRouter API' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
