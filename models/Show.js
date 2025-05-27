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
    images: [
      {
        url: String,
        public_id: String,
        isCover: { type: Boolean, default: false }
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

// 📌 Indice utile per recuperare tutti gli show di un artista
ShowSchema.index({ artist: 1 })

export default model("Show", ShowSchema)
