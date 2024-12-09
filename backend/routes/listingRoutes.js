const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listingController');

router.post('/bulk-upload', listingController.bulkUploadListings);
router.get('/', listingController.getFilteredListings);
router.get('/:id', listingController.getListingById);

module.exports = router;