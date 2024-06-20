const Event = require("../../models/event");
const User = require("../../models/user");
const { datetoString } = require("../../Helpers/date");
const { transformEvent } = require("./merge");

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map((event) => {
        return transformEvent(event);
      });
    } catch (err) {
      throw err;
    }
  },

  createEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthoricated");
    }
    try {
      console.log(req);
      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: args.eventInput.price,
        date: datetoString(args.eventInput.date),
        creator: req.userId,
      });

      const result = await event.save();
      let createdEvent = transformEvent(result);

      let creator = await User.findById(req.userId);
      if (!creator) {
        throw new Error("User not exist in database");
      }

      creator.createdEvents.push(event);
      await creator.save();
      return createdEvent;
    } catch (err) {
      throw err;
    }
  },
};
