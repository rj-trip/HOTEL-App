const mongoose = require('mongoose');

const listings = [
    {
      _id: new mongoose.Types.ObjectId(), // Unique ID
      title: "Lakefront Cabin in New Hampshire",
      description: "Spend your days by the lake in this cozy cabin in the scenic White Mountains of New Hampshire.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1578645510447-e20b4311e3ce"
      },
      price: 1200,
      location: "Delhi",
      country: "India",
      total: 20,
      booked: 12,
      vacate: 8,
      amenities: ["WiFi", "Kitchen", "Parking"]
    },
    // Add more listings...
  ];
  
  module.exports = { listings };