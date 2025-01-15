import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // Ensure email uniqueness
      match: [/.+\@.+\..+/, "Please enter a valid email address"], // Email format validation
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
    },
    role: {
      type: String,
      enum: ["admin", "voter"],
      default: "voter",
    },
    refreshToken: {
      type: String,
    },
    resetPasswordOTP: {
      type: Number,
    },
    resetPasswordExpires: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
