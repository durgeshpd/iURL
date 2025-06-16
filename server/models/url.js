const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
  {
    shortId: {
      type: String,
      required: true,
      unique: true,  // Ensure the shortId is unique
    },
    redirectURL: {
      type: String,
      required: true,
    },
    visitedHistory: [{ timestamp: { type: Number } }],  // Array of visit timestamps
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",  // Reference to the User model
      required: true,
    },
  },
  { timestamps: true }
);

const URL = mongoose.model("url", urlSchema);

module.exports = URL;
