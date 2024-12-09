const Booking = require('../models/Booking');
const Listing = require('../models/Listing');

exports.createBooking = async (req, res) => {
  try {
    const { 
      listingId, 
      userId, 
      fromDate, 
      toDate, 
      seats 
    } = req.body;

    // Find listing
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check seat availability
    if (listing.vacate < seats) {
      return res.status(400).json({ message: 'Not enough seats available' });
    }

    // Create booking
    const booking = new Booking({
      user: userId,
      listing: listingId,
      fromDate,
      toDate,
      seats,
      totalPrice: listing.price * seats
    });

    // Save booking
    await booking.save();

    // Update listing seats
    listing.booked += seats;
    listing.vacate -= seats;
    await listing.save();

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllBookings = async (req, res) => {
    try {
      const bookings = await Booking.find()
        .populate('user', 'name email')
        .populate('listing', 'name location');
      res.status(200).json(bookings);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  exports.getBookingById = async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id)
        .populate('user', 'name email')
        .populate('listing', 'name location');
      
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      
      res.status(200).json(booking);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  exports.updateBooking = async (req, res) => {
    try {
      const { listingId, fromDate, toDate, seats } = req.body;
      const booking = await Booking.findById(req.params.id);
  
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
  
      const listing = await Listing.findById(listingId || booking.listing);
      
      // Adjust seat calculation if seats are being modified
      const seatDifference = seats - booking.seats;
      
      if (listing.vacate < seatDifference) {
        return res.status(400).json({ message: 'Not enough seats available' });
      }
  
      booking.fromDate = fromDate || booking.fromDate;
      booking.toDate = toDate || booking.toDate;
      booking.seats = seats || booking.seats;
      booking.totalPrice = listing.price * booking.seats;
  
      await booking.save();
  
      // Update listing seats
      listing.booked += seatDifference;
      listing.vacate -= seatDifference;
      await listing.save();
  
      res.status(200).json(booking);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  exports.deleteBooking = async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id);
  
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
  
      const listing = await Listing.findById(booking.listing);
      
      // Restore listing availability
      listing.booked -= booking.seats;
      listing.vacate += booking.seats;
      await listing.save();
  
      await Booking.findByIdAndDelete(req.params.id);
  
      res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };