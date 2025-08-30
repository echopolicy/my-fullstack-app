const express = require('express');
const router = express.Router();
const Poll = require('../models/Poll');
const { Op } = require('sequelize');

// Create a new poll
router.post('/', async (req, res) => {
  try {
    const { options, question, category, tags, closeDate, pollType, visibilityPublic, trending, userId } = req.body;

    if (!Array.isArray(options) || options.length === 0) {
      return res.status(400).json({ error: 'Options must be a non-empty array' });
    }

    const pollData = {
      question,
      category,
      tags: tags || [],
      closeDate: closeDate || null,
      pollType,
      visibilityPublic: visibilityPublic,
      options,
      votes: Array(options.length).fill(0),
      trending: trending || false,
      user_id: userId || null, // use userId from request body
    };

    const poll = await Poll.create(pollData);
    res.status(201).json(poll);
  } catch (error) {
    console.error('Poll creation error:', error);
    res.status(400).json({ error: 'Failed to create poll' });
  }
});

// Get featured/trending polls
router.get('/featured', async (req, res) => {
  try {
    const polls = await Poll.findAll({ where: { trending: true } });
    res.json(polls);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Get all polls or filter by category or user_id
router.get('/', async (req, res) => {
  const { category, user_id } = req.query;
  try {
    const where = {};

    if (user_id) {
      // Filter polls created by the user
      where.user_id = user_id;
    } else {
      // Public polls with open/valid close dates
      where.visibilityPublic = true;
      where[Op.or] = [
        { closeDate: null },
        { closeDate: { [Op.gt]: new Date() } },
      ];
    }

    if (category) {
      where.category = category;
    }

    const polls = await Poll.findAll({ where });
    res.json(polls);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Get poll by ID
router.get('/:id', async (req, res) => {
  try {
    const poll = await Poll.findByPk(req.params.id);
    if (!poll) return res.status(404).json({ error: 'Poll not found' });
    res.json(poll);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch poll' });
  }
});

// Vote on a poll
router.put('/:id/vote', async (req, res) => {
  const { optionIndexes } = req.body;

  try {
    const poll = await Poll.findByPk(req.params.id);
    if (!poll) return res.status(404).json({ message: 'Poll not found' });

    let updatedVotes = [...poll.votes];

    if (Array.isArray(optionIndexes)) {
      for (let idx of optionIndexes) {
        if (idx >= 0 && idx < updatedVotes.length) {
          updatedVotes[idx] += 1;
        }
      }
    } else if (typeof optionIndexes === 'number') {
      if (optionIndexes >= 0 && idx < updatedVotes.length) {
        updatedVotes[optionIndexes] += 1;
      }
    } else {
      return res.status(400).json({ message: 'Invalid option indexes' });
    }

    poll.votes = updatedVotes;
    await poll.save();

    res.json(poll);
  } catch (err) {
    console.error('Vote error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Edit a poll
router.put('/:id', async (req, res) => {
  try {
    const poll = await Poll.findByPk(req.params.id);
    if (!poll) return res.status(404).json({ message: 'Poll not found' });

    await poll.update(req.body);
    res.json(poll);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Delete a poll
router.delete('/:id', async (req, res) => {
  try {
    const poll = await Poll.findByPk(req.params.id);
    if (!poll) return res.status(404).json({ message: 'Poll not found' });

    await poll.destroy();
    res.json({ message: 'Poll deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;