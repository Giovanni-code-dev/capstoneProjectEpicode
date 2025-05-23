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
    image: {
      type: String, // URL immagine (es. Cloudinary o link esterno)
    },
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

export default model("Package", PackageSchema)
