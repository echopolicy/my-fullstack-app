const express = require('express');
const router = express.Router();
const Poll = require('../models/Poll');
const { Op } = require('sequelize');


router.post('/', async (req, res) => {
  try {
    const { options } = req.body;

    if (!Array.isArray(options)) {
      return res.status(400).json({ error: 'Options must be an array' });
    }

    req.body.votes = Array(options.length).fill(0);

    const poll = await Poll.create(req.body);
    res.status(201).json(poll);
  } catch (error) {
    console.error(error);
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

// Get all polls or filter by category

router.get('/', async (req, res) => {
  const { category } = req.query;
  try {
    const where = {
      [Op.or]: [
        { closeDate: null },
        { closeDate: { [Op.gt]: new Date() } } // closeDate greater than now
      ]
    };

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
  const { optionIndex } = req.body;

  try {
    const poll = await Poll.findByPk(req.params.id);
    if (!poll) return res.status(404).json({ message: 'Poll not found' });

    const options = [...poll.options];
    const votes = [...poll.votes];

    if (optionIndex < 0 || optionIndex >= options.length) {
      return res.status(400).json({ message: 'Invalid option index' });
    }

    // Update options array (optional, only if you're tracking votes there too)
    if (!options[optionIndex].votes) options[optionIndex].votes = 0;
    options[optionIndex].votes += 1;

    // Update votes array (this is what your model actually saves)
    votes[optionIndex] += 1;

    // Save changes
    poll.options = options;
    poll.votes = votes;

    await poll.save();
    res.json(poll);
  } catch (err) {
    console.error(err);
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