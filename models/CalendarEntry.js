import { Schema, model } from "mongoose"

const CalendarEntrySchema = new Schema(
  {
    artist: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "unavailable", "booked"],
      default: "available",
    },
    notes: {
      type: String,
    }
  },
  { timestamps: true }
)

export default model("CalendarEntry", CalendarEntrySchema)
