const Booking = require("../../models/booking");
const Event = require("../../models/event");
const { transformEvent, transfromBooking } = require("./merge");

module.exports = {
  bookings: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthoricated");
    }
    try {
      const bookings = await Booking.find({ user: req.userId });
      return bookings.map((booking) => {
        return transfromBooking(booking);
      });
    } catch (err) {
      throw err;
    }
  },

  bookEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthoricated");
    }
    try {
      const fetchedEvent = await Event.findOne({ _id: args.eventId });
      const booking = new Booking({
        user: req.userId,
        event: fetchedEvent,
      });

      const result = await booking.save();

      return transfromBooking(result);
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  cancelBooking: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthoricated");
    }
    try {
      const booking = await Booking.findById(args.bookingId).populate("event");
      const selectedEvent = transformEvent(booking.event);
      await Booking.deleteOne({ _id: args.bookingId });
      return selectedEvent;
    } catch (err) {
      throw err;
    }
  },
};
