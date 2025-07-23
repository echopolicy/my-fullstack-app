const express = require('express');
const router = express.Router();

// Example route
router.get('/api/example', (req, res) => {
    res.json({ message: 'Hello from the backend!' });
});

// Add more routes here

module.exports = router;