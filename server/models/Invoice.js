const mongoose = require('mongoose');

const invoiceItemSchema = new mongoose.Schema(
  {
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    gst: { type: Number, default: 0, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    discountType: { type: String, enum: ['percent', 'fixed'], default: 'percent' },
    total: { type: Number, required: true },
  },
  { _id: false }
);

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      unique: true,
      index: true,
    },
    customerName: { type: String, required: [true, 'Customer name is required'], trim: true },
    phone: { type: String, trim: true, default: '' },
    email: { type: String, trim: true, default: '' },
    address: { type: String, trim: true, default: '' },
    items: { type: [invoiceItemSchema], required: true },
    subtotal: { type: Number, required: true, default: 0 },
    totalGST: { type: Number, default: 0 },
    totalDiscount: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true, default: 0 },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['draft', 'sent', 'paid'], default: 'draft' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

// Auto-generate invoice number before saving
invoiceSchema.pre('save', async function (next) {
  if (this.invoiceNumber) return next();
  try {
    const year = new Date().getFullYear();
    const prefix = `INV-${year}-`;
    // Find the last invoice for this year
    const last = await mongoose
      .model('Invoice')
      .findOne({ invoiceNumber: new RegExp(`^${prefix}`) })
      .sort({ invoiceNumber: -1 })
      .select('invoiceNumber');

    let seq = 1;
    if (last && last.invoiceNumber) {
      const parts = last.invoiceNumber.split('-');
      seq = parseInt(parts[parts.length - 1], 10) + 1;
    }
    this.invoiceNumber = `${prefix}${String(seq).padStart(4, '0')}`;
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('Invoice', invoiceSchema);
