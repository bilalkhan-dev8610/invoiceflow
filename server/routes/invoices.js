const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const { protect } = require('../middleware/auth');

router.use(protect);

// GET /api/invoices — sirf apne invoices
router.get('/', async (req, res) => {
  try {
    const invoices = await Invoice.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 })
      .select('invoiceNumber customerName email date grandTotal status');
    res.json({ success: true, data: invoices });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/invoices/:id — sirf apna invoice dekh sakta hai
router.get('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found.' });
    res.json({ success: true, data: invoice });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/invoices — naya invoice banao
router.post('/', async (req, res) => {
  try {
    const {
      customerName, phone, email, address,
      items, subtotal, totalGST, totalDiscount, grandTotal, date,
    } = req.body;

    if (!customerName || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Customer name and at least one item are required.',
      });
    }

    const invoice = await Invoice.create({
      customerName, phone, email, address,
      items, subtotal, totalGST, totalDiscount, grandTotal,
      date: date || new Date(),
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, data: invoice });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/invoices/:id/status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['draft', 'sent', 'paid'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status.' });
    }
    const invoice = await Invoice.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      { status },
      { new: true }
    );
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found.' });
    res.json({ success: true, data: invoice });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/invoices/:id
router.delete('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    });
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found.' });
    res.json({ success: true, message: 'Invoice deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;