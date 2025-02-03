// Search endpoint
app.get('/api/content/search', async (req, res) => {
    try {
      const { query } = req.query;
      const results = await Content.find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { genre: { $regex: query, $options: 'i' } },
          { cast: { $regex: query, $options: 'i' } }
        ]
      }).limit(10);
      
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: 'Search failed', error: error.message });
    }
  });
  
  // Get featured content (for home page)
  app.get('/api/content/featured', async (req, res) => {
    try {
      const featured = await Content.find()
        .sort({ rating: -1, createdAt: -1 })
        .limit(5);
      
      res.json(featured);
    } catch (error) {
      res.status(500).json({ message: 'Failed to load featured', error: error.message });
    }
  });