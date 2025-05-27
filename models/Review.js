import { Schema, model } from "mongoose"

const ReviewSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    artist: { type: Schema.Types.ObjectId, ref: "User", required: true },
    request: { type: Schema.Types.ObjectId, ref: "Request", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    images: [{ type: String }], // URL immagini
    date: { type: Date, default: Date.now }
  },
  { timestamps: true }
)

export default model("Review", ReviewSchema)
