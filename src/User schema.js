// Add to User schema
const userSchema = new mongoose.Schema({
    // ... existing fields ...
    playHistory: [{
      contentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Content' },
      watchedAt: { type: Date, default: Date.now }
    }],
    preferences: {
      favoriteGenres: [String],
      watchedContent: [{
        contentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Content' },
        lastWatched: Date
      }]
    }
  });
  
  // Record play history
  app.post('/api/content/play', authenticateUser, async (req, res) => {
    try {
      const { contentId } = req.body;
      await User.findByIdAndUpdate(req.user.id, {
        $push: {
          'playHistory': { contentId },
          'preferences.watchedContent': { contentId, lastWatched: new Date() }
        }
      });
      
      res.json({ message: 'Play recorded' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to record play', error: error.message });
    }
  });
  
  // Get recommendations
  app.get('/api/recommendations', authenticateUser, async (req, res) => {
    try {
      const user = await User.findById(req.user.id)
        .populate('preferences.watchedContent.contentId');
      
      const favoriteGenres = user.preferences.favoriteGenres;
      const watchedIds = user.playHistory.map(item => item.contentId);
      
      const recommendations = await Content.find({
        $or: [
          { genre: { $in: favoriteGenres } },
          { _id: { $nin: watchedIds } }
        ]
      })
      .sort({ rating: -1 })
      .limit(5);
      
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get recommendations', error: error.message });
    }
  });