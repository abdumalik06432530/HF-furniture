import mongoose from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },

    role: {
      type: String,
      required: true,
      enum: ["user", "admin"],
  default: "user",
    },

    phone: { type: String, required: true },
  // whether the user account is active (admin can deactivate)
  isActive: { type: Boolean, default: true },

    cartData: { type: Object, default: {} },

    createdAt: { type: Date, default: Date.now },

    lastLogin: { type: Date },
  },
  { minimize: false }
);

// 🔹 Pre-save hook to hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// 🔹 Instance method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// 🔹 Prevent model overwrite error when hot reloading
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
