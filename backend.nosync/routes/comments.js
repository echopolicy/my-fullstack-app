// routes/comments.js
const express = require('express');
const Comment = require('../models/Comment');
const User = require('../models/User');
const Poll = require('../models/Poll');

const router = express.Router();

/**
 * GET /comments/poll/:pollId
 * Returns a nested tree of comments for the poll (top-level comments, each with `replies` array)
 */
router.get('/poll/:pollId', async (req, res) => {
  try {
    const pollId = req.params.pollId;

    // fetch ALL comments for this poll (flat list), including the user who posted each comment
    const allComments = await Comment.findAll({
      where: { poll_id: pollId },
      include: [
        { model: User, as: 'user', attributes: ['id', 'fullName', 'email'] }
      ],
      order: [['created_at', 'ASC']],
    });

    // convert Sequelize instances to plain objects
    const rows = allComments.map(c => c.toJSON());

    // build map of id -> comment and initialize replies arrays
    const byId = {};
    rows.forEach(c => {
      c.replies = []; // ensure replies array exists
      byId[c.id] = c;
    });

    // assemble the tree
    const tree = [];
    rows.forEach(c => {
      if (c.parent_id) {
        const parent = byId[c.parent_id];
        if (parent) {
          parent.replies.push(c);
        } else {
          // parent not found (orphaned) — place at top-level to avoid losing it
          tree.push(c);
        }
      } else {
        // top-level comment
        tree.push(c);
      }
    });

    res.json(tree);
  } catch (err) {
    console.error('Fetch comments error:', err);
    res.status(500).json({ error: 'Failed to load comments' });
  }
});

/**
 * POST /comments/poll/:pollId
 * body: { user_id, content, parent_id (optional) }
 */
router.post('/poll/:pollId', async (req, res) => {
  try {
    const { user_id, content, parent_id } = req.body;
    const pollId = req.params.pollId;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const poll = await Poll.findByPk(pollId);
    if (!poll) return res.status(404).json({ error: 'Poll not found' });

    const comment = await Comment.create({
      poll_id: pollId,
      user_id,
      content,
      parent_id: parent_id || null
    });

    // return the created comment including the user (so frontend has the same shape)
    const createdComment = await Comment.findByPk(comment.id, {
      include: [{ model: User, as: 'user', attributes: ['id', 'fullName', 'email'] }]
    });

    res.status(201).json(createdComment ? createdComment.toJSON() : comment);
  } catch (err) {
    console.error('Add comment error:', err);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

/**
 * DELETE /comments/:id
 */
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