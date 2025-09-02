const express = require('express');
const Comment = require('../models/Comment');
const User = require('../models/User');
const Poll = require('../models/Poll');

const router = express.Router();

// Get all comments for a poll
router.get('/poll/:pollId', async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: { poll_id: req.params.pollId, parent_id: null },
      include: [
        { model: User, attributes: ['id', 'fullName', 'email'] },
        { 
          model: Comment, 
          as: 'replies',
          include: [{ model: User, attributes: ['id', 'fullName', 'email'] }]
        }
      ],
      order: [['createdAt', 'ASC']]
    });

    res.json(comments);
  } catch (err) {
    console.error('Fetch comments error:', err);
    res.status(500).json({ error: 'Failed to load comments' });
  }
});

// Add a new comment
router.post('/poll/:pollId', async (req, res) => {
  try {
    const { user_id, content, parent_id } = req.body;

    if (!content) return res.status(400).json({ error: 'Content is required' });

    const poll = await Poll.findByPk(req.params.pollId);
    if (!poll) return res.status(404).json({ error: 'Poll not found' });

    const comment = await Comment.create({
      poll_id: req.params.pollId,
      user_id,
      content,
      parent_id: parent_id || null
    });

    res.status(201).json(comment);
  } catch (err) {
    console.error('Add comment error:', err);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// Delete a comment
router.delete('/:id', async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    await comment.destroy();
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    console.error('Delete comment error:', err);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

module.exports = router;