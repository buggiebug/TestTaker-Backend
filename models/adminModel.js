const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");

const adminSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  role: { type: String, default: "writer" },
  accountCreatedAt: { type: Date, default: new Date() },
});

// Check password before save if it is not modified then hash it else pass next function...
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  } else {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

// Generate Admin token...
adminSchema.methods.generateAdminToken = function () {
  return JWT.sign({ id: this._id }, "This_is_secret_key", { expiresIn: "7d" });
};

// Compare hashed password...
adminSchema.methods.compareAdminPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("admin", adminSchema);
