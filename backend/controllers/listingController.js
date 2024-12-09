const Listing = require('../models/Listing');
const { listings } = require('../data');

exports.bulkUploadListings = async (req, res) => {
  try {
    const result = await Listing.insertMany(listings);
    res.status(201).json({
      message: 'Bulk upload successful',
      count: result.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFilteredListings = async (req, res) => {
  try {
    const { 
      search, 
      priceRange, 
      page = 1, 
      limit = 9
    } = req.query;

    const filter = {};

    // Text search
    if (search) {
      filter.$or = [
        { location: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } }
      ];
    }

    // Price Range Filter
    if (priceRange) {
      switch(priceRange) {
        case '1-2000':
          filter.price = { $gte: 1, $lte: 2000 };
          break;
        case '2000-4000':
          filter.price = { $gte: 2000, $lte: 4000 };
          break;
        case '4000-6000':
          filter.price = { $gte: 4000, $lte: 6000 };
          break;
        case '6000+':
          filter.price = { $gt: 6000 };
          break;
      }
    }

    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNumber - 1) * pageSize;

    const listings = await Listing.find(filter)
      .skip(skip)
      .limit(pageSize);

    const totalListings = await Listing.countDocuments(filter);

    res.json({
      listings,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalListings / pageSize),
      totalListings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};