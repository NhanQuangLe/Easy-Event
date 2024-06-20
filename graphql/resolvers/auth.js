const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
module.exports = {
  createUser: async (args) => {
    try {
      const exitUser = await User.findOne({ email: args.userInput.email });
      if (exitUser) {
        throw new Error("User already exists");
      }

      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
      const user = new User({
        email: args.userInput.email,
        password: hashedPassword,
      });

      const userSaveResult = await user.save();
      return { ...userSaveResult._doc, password: null };
    } catch (err) {
      throw err;
    }
  },

  login: async ({ email, password }) => {
    try {
      const exitedUser = await User.findOne({ email: email });
      if (!exitedUser) {
        throw new Error("User is not exited");
      }

      const isEqual = await bcrypt.compare(password, exitedUser.password);

      if (!isEqual) {
        throw new Error("Password is incorrect");
      }

      const token = jwt.sign(
        { userId: exitedUser.id, email: exitedUser.email },
        "somesupersecretkey",
        { expiresIn: "1h" }
      );

      return { userId: exitedUser.id, token: token, tokenExpiration: 1 };
    } catch (err) {
      throw err;
    }
  },
};
