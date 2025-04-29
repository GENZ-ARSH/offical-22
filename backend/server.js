require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { v4: uuidv4 } = require('uuid');
const fetch = require('node-fetch');
const path = require('path');
const serverless = require('serverless-http');

const app = express();

// Dynamic CORS configuration
const allowedOrigins = [
  'http://localhost:5000',
  process.env.NETLIFY_URL || 'https://your-netlify-site.netlify.app'
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../frontend')));

// Validate environment variables
const JWT_SECRET = process.env.JWT_SECRET || (() => {
  console.warn('Warning: JWT_SECRET is not set. Using default value.');
  return 'default-insecure-secret';
})();
const LINK_PAYS_API_KEY = process.env.LINK_PAYS_API_KEY || (() => {
  console.warn('Warning: LINK_PAYS_API_KEY is not set.');
  return null;
})();

// In-memory storage (replace with MongoDB in production)
let books = [
  {
    id: uuidv4(),
    title: 'Concept of Physics',
    author: 'H.C. Verma',
    class: '12',
    exam: 'JEE',
    image_url: 'https://via.placeholder.com/150',
    link: 'https://example.com/physics.pdf',
    clicks: 0
  }
];

// Generate short URL using LinkPays API (GET request)
async function generateShortUrl(duration) {
  if (!LINK_PAYS_API_KEY) {
    console.error('Error: LINK_PAYS_API_KEY is not set.');
    return process.env.NETLIFY_URL 
      ? `${process.env.NETLIFY_URL}/home.html`
      : 'http://localhost:5000/home.html';
  }
  try {
    const baseUrl = process.env.NETLIFY_URL 
      ? `${process.env.NETLIFY_URL}/home.html`
      : 'http://localhost:5000/home.html';
    console.log('Generating short URL for:', baseUrl);
    const apiUrl = `https://linkpays.in/api?api=${LINK_PAYS_API_KEY}&url=${encodeURIComponent(baseUrl)}`;
    console.log('Calling LinkPays API:', apiUrl);
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    console.log('LinkPays API response:', JSON.stringify(data, null, 2));
    if (data.status === 'success' && data.shortenedUrl) {
      return data.shortenedUrl;
    } else {
      console.error('LinkPays API error:', data.message || data);
      return process.env.NETLIFY_URL 
        ? `${process.env.NETLIFY_URL}/home.html`
        : 'http://localhost:5000/home.html';
    }
  } catch (error) {
    console.error('Error generating short URL:', error);
    return process.env.NETLIFY_URL 
      ? `${process.env.NETLIFY_URL}/home.html`
      : 'http://localhost:5000/home.html';
  }
}

// Generate JWT token
const generateToken = (payload, expiresIn) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

// Generate key endpoint
app.post('/api/generate-key', async (req, res) => {
  try {
    const { duration, userId, url } = req.body;
    if (!['24hr', '48hr'].includes(duration)) {
      return res.status(400).json({ error: 'Invalid duration' });
    }
    const expiresIn = duration === '24hr' ? '24h' : '48h';
    const expiry = Date.now() + (duration === '24hr' ? 24 * 60 * 60 * 1000 : 48 * 60 * 60 * 1000);
    const token = generateToken({ userId, url }, expiresIn);
    const shortUrl = await generateShortUrl(duration);
    if (!shortUrl) {
      return res.status(500).json({ error: 'Failed to generate short URL' });
    }
    res.json({ token, expiry, shortUrl });
  } catch (error) {
    console.error('Generate key error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Validate key endpoint
app.post('/api/validate-key', (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: 'Token required' });
    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }
      const shortUrl = await generateShortUrl(decoded.url.includes('24hr') ? '24hr' : '48hr');
      if (!shortUrl) {
        return res.status(500).json({ error: 'Failed to generate short URL' });
      }
      res.json({ success: true, shortUrl, expiry: decoded.exp * 1000 });
    });
  } catch (error) {
    console.error('Validate key error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin login endpoint
app.post('/api/admin-login', (req, res) => {
  try {
    const { password } = req.body;
    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Invalid password' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get books endpoint
app.get('/api/books', (req, res) => {
  try {
    const { class: classFilter, exam } = req.query;
    let filteredBooks = books;
    if (classFilter && classFilter !== 'all') {
      filteredBooks = filteredBooks.filter(book => book.class === classFilter);
    }
    if (exam && exam !== 'all') {
      filteredBooks = filteredBooks.filter(book => book.exam === exam);
    }
    res.json(filteredBooks);
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add book endpoint
app.post('/api/books', (req, res) => {
  try {
    const { title, author, class: bookClass, exam, image_url, link } = req.body;
    if (!title || !author || !bookClass || !exam || !image_url || !link) {
      return res.status(400).json({ error: 'All fields required' });
    }
    const book = {
      id: uuidv4(),
      title,
      author,
      class: bookClass,
      exam,
      image_url,
      link,
      clicks: 0
    };
    books.push(book);
    res.json({ success: true, book });
  } catch (error) {
    console.error('Add book error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete book endpoint
app.delete('/api/books/:id', (req, res) => {
  try {
    const bookId = req.params.id;
    const index = books.findIndex(book => book.id === bookId);
    if (index === -1) return res.status(404).json({ error: 'Book not found' });
    books.splice(index, 1);
    res.json({ success: true });
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Track book click endpoint
app.post('/api/books/:id/click', (req, res) => {
  try {
    const bookId = req.params.id;
    const book = books.find(book => book.id === bookId);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    book.clicks += 1;
    res.json({ success: true, clicks: book.clicks });
  } catch (error) {
    console.error('Track click error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Export for Netlify Functions
module.exports.handler = serverless(app);

// Add for local testing
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})
