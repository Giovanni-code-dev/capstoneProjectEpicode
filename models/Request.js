import { Schema, model } from "mongoose"

const RequestSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    artist: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    packages: [
      {
        type: Schema.Types.ObjectId,
        ref: "Package",
      },
    ],
    shows: [  // ✅ ora può contenere più di uno show
      {
        type: Schema.Types.ObjectId,
        ref: "Show",
      }
    ],
    location: {
      address: String,
      city: String,
    },
    distanceKm: {
      type: Number,
    },
    date: {
      type: Date,
      required: true,
    },
    message: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined"], // ✅ enum lato server
      default: "pending",
    },
  },
  { timestamps: true }
)

export default model("Request", RequestSchema)
