require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const express = require("express");
const userRouter = require("./router/user");
const taskRouter = require("./router/task");
require("./db/mongoose");

const app = express();
const port = process.env.PORT;

// This line tells express that we are expecting json data and you have to parse it.
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.use((req, res, next) => {
  res.status(400).send({ error: `${req.path} route not defined` });
  next();
});

app.listen(port, () => console.log("Server is listening on port:", port));
