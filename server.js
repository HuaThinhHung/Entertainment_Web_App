const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'about.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'contact.html'));
});

app.get('/watchlist', (req, res) => {
    res.sendFile(path.join(__dirname, 'watchlist.html'));
});

// API endpoint for TMDB (proxy to avoid CORS issues)
app.get('/api/movies', async (req, res) => {
    try {
        const response = await fetch('https://api.themoviedb.org/3/movie/popular?api_key=1b7c076a0e4849aeefd1f3c429c79f3b&language=en-US&page=1');
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch movies' });
    }
});

app.get('/api/tv', async (req, res) => {
    try {
        const response = await fetch('https://api.themoviedb.org/3/tv/popular?api_key=1b7c076a0e4849aeefd1f3c429c79f3b&language=en-US&page=1');
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch TV shows' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📱 Open your browser and navigate to: http://localhost:${PORT}`);
    console.log(`📁 Serving files from: ${__dirname}`);
}); 