import { Schema, model } from "mongoose"

const ShowSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["danza aerea", "trampoli", "giocoleria", "mimo", "fuoco", "altro"],
      required: true,
    },
    durationMinutes: {
      type: Number,
      default: 30,
    },
    image: {
      type: String, // URL Cloudinary o simile
    },
    artist: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
)

export default model("Show", ShowSchema)
