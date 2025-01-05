const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Disable validation on `firstName` and `lastName` during updates
userSchema.pre("validate", function (next) {
  if (this.isModified("password")) {
    this.invalidate("firstName", undefined);
    this.invalidate("lastName", undefined);
  }
  next();
});

module.exports = mongoose.model("User", userSchema);

