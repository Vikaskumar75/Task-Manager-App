const mongoose = require("mongoose");

const schemaOptions = {
  timestamps: true,
};

const schema = {
  description: {
    type: String,
    required: true,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
};

const taskSchema = mongoose.Schema(schema, schemaOptions);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
