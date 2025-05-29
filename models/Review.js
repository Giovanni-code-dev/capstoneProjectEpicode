import { Schema, model } from "mongoose"

const ReviewSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    artist: { type: Schema.Types.ObjectId, ref: "Artist", required: true },
    request: { type: Schema.Types.ObjectId, ref: "Request", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    images: [{ type: String }],
    date: { type: Date, default: Date.now }
  },
  { timestamps: true }
)


// ⚡ Indici per performance e unicità
ReviewSchema.index({ artist: 1 })
ReviewSchema.index({ user: 1 })
ReviewSchema.index({ request: 1 }, { unique: true })

export default model("Review", ReviewSchema)
