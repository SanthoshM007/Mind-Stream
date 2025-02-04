require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/search', async (req, res) => {
  const query = req.query.q;
  const API_KEY = process.env.YOUTUBE_API_KEY;
  const endpoint = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=10&key=${API_KEY}`;

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error('Failed to fetch search results from YouTube API.');
    }
    const json = await response.json();
    res.json(json.items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});