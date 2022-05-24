const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    const token = req.headers["authorization"].replace("Bearer ", "");
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ _id: payload.id, "tokens.token": token });
    if (!user) throw new Error();
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401);
    res.send({ error: "Please provide a valid Authorization token." });
  }
};

module.exports = auth;
