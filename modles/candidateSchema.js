import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const candidateSchema = new mongoose.Schema(
  {
    candidateElectionId: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    aadhaarId: {
      type: Number,
      unique: true,
      required: true, // Make this field required
      validate: {
        validator: function (v) {
          return /^\d{12}$/.test(v); // Ensure the Aadhaar ID is exactly 12 digits
        },
        message: (props) =>
          `${props.value} is not a valid Aadhaar ID! Aadhaar ID must be exactly 12 digits.`,
      },
    },
    candidatename: {
      type: String,
      required: true,
    },
    party: {
      type: String,
      required: true,
    },
    votesReceived: {
      type: Number,
      default: 0
    },
    electionSymbol: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

const Candidate = mongoose.model("Candidate", candidateSchema);

export default Candidate;
