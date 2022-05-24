const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("./task");

const schemaOptions = {
  timestamps: true,
};

const schema = {
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: [true, "This email is already taken"],
    required: [true, "Please provide an email"],
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) throw Error("Email is invalid");
    },
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    trim: true,
    minLength: [7, "password should be greater 6 characters"],
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw Error("Please use a different password");
      }
    },
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) throw Error("Age cannot be less than zero");
    },
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  avatar: {
    type: Buffer,
  },
};

const userSchema = mongoose.Schema(schema, schemaOptions);

userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner",
});

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  if (user.avatar) userObject.avatar = "/users/" + user._id + "/avatar";

  delete userObject.password;
  delete userObject.tokens;
  delete userObject.__v;

  return userObject;
};

userSchema.methods.createJwtToken = async function () {
  const user = this;
  const token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET);
  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email: email });
  if (!user) throw Error("No user find with that email");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw Error("Invalid password");

  return user;
};

// Hash password before saving
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

// Delete task when user is deleted
userSchema.pre("remove", async function (next) {
  const user = this;
  await Task.deleteMany({ owner: user._id });
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
