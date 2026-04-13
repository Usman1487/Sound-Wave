const express = require('express');
const router = express.Router();

router.get('/search', async (req, res) => {
  const { q } = req.query;
  try {
    const response = await fetch(`https://api.deezer.com/search?q=${q}&limit=20`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch from Deezer' });
  }
});

module.exports = router;