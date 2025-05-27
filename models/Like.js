import { Schema, model } from "mongoose"

const LikeSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    targetType: {
      type: String,
      enum: ["artist", "show", "package"],
      required: true,
    },
    targetId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
)

// 🔒 Impedisce che lo stesso utente metta like più volte allo stesso oggetto
LikeSchema.index({ user: 1, targetType: 1, targetId: 1 }, { unique: true })

export default model("Like", LikeSchema)
