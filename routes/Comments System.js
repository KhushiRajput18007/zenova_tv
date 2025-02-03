const commentSchema = new mongoose.Schema({
    contentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Content', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  });
  
  const Comment = mongoose.model('Comment', commentSchema);
  
  // Add comment
  app.post('/api/comments', authenticateUser, async (req, res) => {
    try {
      const { contentId, text } = req.body;
      const newComment = new Comment({
        contentId,
        userId: req.user.id,
        text
      });
      
      await newComment.save();
      res.status(201).json(newComment);
    } catch (error) {
      res.status(500).json({ message: 'Failed to post comment', error: error.message });
    }
  });
  
  // Get comments for content
  app.get('/api/comments/:contentId', async (req, res) => {
    try {
      const comments = await Comment.find({ contentId: req.params.contentId })
        .populate('userId', 'name')
        .sort({ timestamp: -1 });
      
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get comments', error: error.message });
    }
  });