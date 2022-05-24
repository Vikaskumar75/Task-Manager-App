const mongoose = require("mongoose");

mongoose.connect(
  process.env.MONGODB_CONNECTION_STRING,
  { useNewUrlParser: true },
  (error) => {
    if (error) return console.log(error);
    console.log("Successfully Connected to database");
  }
);
