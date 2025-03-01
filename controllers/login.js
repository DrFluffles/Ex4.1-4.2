const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const User = require("../models/user");

loginRouter.post("/", async (request, response) => {
  try {
    const { username, password } = request.body;

    console.log("Received login request for username:", username);
    console.log("Entered password:", password);

    if (!username || !password) {
      return response.status(400).json({
        error: "username or password missing",
      });
    }

    const user = await User.findOne({ username });
    console.log("User found in DB:", user);

    const passwordCorrect =
      user === null ? false : await bcrypt.compare(password, user.passwordHash);

    if (!(user && passwordCorrect)) {
      return response.status(401).json({
        error: "invalid username or password",
      });
    }

    const userForToken = {
      username: user.username,
      id: user._id,
    };

    const token = jwt.sign(userForToken, process.env.SECRET);

    response
      .status(200)
      .send({ token, username: user.username, name: user.name });
  } catch (error) {
    console.error("Error during login:", error);
    response.status(500).json({
      error: "internal server error",
    });
  }
});

module.exports = loginRouter;
