require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// API Endpoint to get global financial news
app.get('/api/global-news', async (req, res) => {
  try {
    const response = await axios.get(`https://newsapi.org/v2/everything?q=finance&sortBy=publishedAt&apiKey=${process.env.GLOBAL_NEWS_API_KEY}`);
    res.json(response.data.articles);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching global financial news' });
  }
});

// API Endpoint for Indian Stock Exchange data
app.get('/api/indian-stocks', async (req, res) => {
    const { symbol } = req.query;
  
    if (!symbol) {
      return res.status(400).json({ error: 'Company symbol is required' });
    }
  
    try {
      const response = await axios.get(
        `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&outputsize=full&apikey=${process.env.INDIAN_NEWS_API_KEY}`
      );
  
      const data = response.data;
  
      if (!data || !data['Time Series (5min)']) {
        return res.status(404).json({ error: `No data found for symbol: ${symbol}` });
      }
  
      res.json(data);
    } catch (error) {
      console.error(`Error fetching stock data for symbol ${symbol}:`, error.message);
      res.status(500).json({ error: 'Failed to fetch stock data' });
    }
  });
  

// API Endpoint for Cryptocurrency trends
app.get('/api/crypto-trends', async (req, res) => {
    try {
      const response = await axios.get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest`, {
        headers: { 'X-CMC_PRO_API_KEY': process.env.CRYPTO_API_KEY}
      });
  
      // Send the full response structure (status + data)
      res.json({
        status: response.data.status,
        data: response.data.data, // Cryptocurrency array
      });
    } catch (error) {
      console.error('Error fetching cryptocurrency data:', error.message);
      res.status(500).json({ error: 'Error fetching cryptocurrency data' });
    }
  });
  

// API Endpoint for latest news by category
app.get('/api/news-feed', async (req, res) => {
    try {
      // Get the category from the query parameters (default to 'business' if not provided)
      const category = req.query.category || 'business';
  
      // Make the API call with the dynamic category parameter
      const response = await axios.get(`https://newsapi.org/v2/top-headlines`, {
        params: {
          category: category,
          country: 'us', // Fixed country to 'us', as per the requirement
          apiKey: process.env.GLOBAL_NEWS_API_KEY,
        },
      });
  
      res.json(response.data.articles); // Send the news articles as the response
    } catch (error) {
      res.status(500).json({ error: 'Error fetching news feed' });
    }
  });
  
  

// Default Route
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
