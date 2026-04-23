const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const { protect } = require('../middleware/auth');

router.use(protect);

// GET /api/items — sirf apne items
router.get('/', async (req, res) => {
  try {
    const items = await Item.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/items
router.post('/', async (req, res) => {
  try {
    const { name, description, variants, price } = req.body;
    if (!name || price === undefined) {
      return res.status(400).json({ success: false, message: 'Name and price are required.' });
    }
    const item = await Item.create({
      name, description, variants, price,
      createdBy: req.user._id,
    });
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/items/:id — sirf apna item update kar sakta hai
router.put('/:id', async (req, res) => {
  try {
    const item = await Item.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!item) return res.status(404).json({ success: false, message: 'Item not found.' });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/items/:id — sirf apna item delete kar sakta hai
router.delete('/:id', async (req, res) => {
  try {
    const item = await Item.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    });
    if (!item) return res.status(404).json({ success: false, message: 'Item not found.' });
    res.json({ success: true, message: 'Item deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;