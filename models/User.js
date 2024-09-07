import mongoose from "mongoose";

const Signupschema = new mongoose.Schema({
  Username: {
    type: String,
    required: true,
    unique: true,
  },
  Mobile: {
    type: Number,
    required: true,
  },
  Email: {
    type: String,
    required: true,
  },
  Password: {
    type: String,
    required: true,
  },
  Gender: {
    type: String,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  }
});

export const User = mongoose.model("User", Signupschema);
