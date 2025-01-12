import mongoose from "mongoose";

const voterSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    aadharNo: {
      type: Number,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^\d{12}$/.test(v); // Regular expression to check 12-digit Aadhar number
        },
        message: (props) =>
          `${props.value} is not a valid 12-digit Aadhar number!`,
      },
    },
    state: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          const birthDate = new Date(value);
          const ageDiff = Date.now() - birthDate.getTime();
          const ageDate = new Date(ageDiff);
          const age = Math.abs(ageDate.getUTCFullYear() - 1970);
          return age >= 18; // Ensure age is 18 or older
        },
        message: "You must be at least 18 years old to register.",
      },
    },
    age: {
      type: Number,
      required: true,
    },
    isVoted: {
      type: Boolean,
      default: false,
    },
    votingDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Voter = mongoose.model("Voter", voterSchema);

export default Voter;
