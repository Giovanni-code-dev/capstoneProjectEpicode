import { Schema, model } from "mongoose"

const PackageSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    durationMinutes: {
      type: Number,
      default: 30,
    },
    images: [
      {
        url: String,
        public_id: String,
        isCover: { type: Boolean, default: false }
      }
    ],
    shows: [
      {
        type: Schema.Types.ObjectId,
        ref: "Show",
      }
    ],
    artist: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
)

// 📌 Indice per recuperare pacchetti di un artista
PackageSchema.index({ artist: 1 })

export default model("Package", PackageSchema)
