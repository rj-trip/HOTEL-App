const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: {
    filename: { type: String },
    url: { type: String }
  },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  country: { type: String, required: true },
  total: { type: Number, required: true },
  booked: { type: Number, default: 0 },
  vacate: { type: Number, required: true },
  amenities: [{ type: String }]
}, { timestamps: true });

ListingSchema.index({ location: 'text', title: 'text' });

module.exports = mongoose.model('Listing', ListingSchema);