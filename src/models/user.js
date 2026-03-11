import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS, 10) || 10;

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    verified: { type: Boolean, default: false },
    password: { type: String, required: true },
  },
  { timestamps: true },
);

// hash the password before saving to the database
userSchema.pre("save", async function () {
  // only hash when the password field has been modified or is new
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  this.password = await bcrypt.hash(this.password, salt);
});

// helper method to compare a plain-text password with the hashed one
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
