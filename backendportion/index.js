import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/summarize', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'No text provided' });

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    
    const result = await model.generateContent(`Summarize this:\n\n${text}`);
    const summary = result.response.text();
    
    res.json({ summary });
  } catch (err) {
    console.error("Gemini API Error:", err);
    res.status(500).json({ error: 'Gemini API request failed' });
  }
});

app.listen(3000, () => console.log('Gemini backend running at http://localhost:3000'));