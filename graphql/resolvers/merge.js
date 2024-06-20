const User = require("../../models/user");
const Event = require("../../models/event");
const { datetoString } = require("../../Helpers/date");
const DataLoader = require("dataloader");

const eventLoader = new DataLoader((eventIds) => {
  return events(eventIds);
});

const userLoader = new DataLoader((userIds) => {
  return User.find({ _id: { $in: userIds } });
});

const transformEvent = (event) => {
  return {
    ...event._doc,
    date: datetoString(event._doc.date),
    creator: user.bind(this, event.creator),
  };
};

const transfromBooking = (booking) => {
  return {
    ...booking._doc,
    user: user.bind(this, booking._doc.user),
    event: singleEvent.bind(this, booking._doc.event),
    createdAt: datetoString(booking._doc.createdAt),
    updatedAt: datetoString(booking._doc.updatedAt),
  };
};

const events = async (eventIds) => {
  try {
    console.log(eventIds);
    const events = await Event.find({ _id: { $in: eventIds } });
    return events.map((event) => {
      return transformEvent(event);
    });
  } catch (err) {
    throw err;
  }
};

const singleEvent = async (eventId) => {
  try {
    const singleEvent = await eventLoader.load(eventId.toString());
    if (!singleEvent) {
      throw new Error("Event is not exits");
    }

    return singleEvent;
  } catch (err) {
    throw err;
  }
};

const user = async (userId) => {
  try {
    const user = await userLoader.load(userId.toString());
    return {
      ...user._doc,
      createdEvents: events.bind(this, user._doc.createdEvents),
    };
  } catch (err) {
    throw err;
  }
};

exports.transformEvent = transformEvent;
exports.transfromBooking = transfromBooking;
