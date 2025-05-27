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

// 🔒 Impedisce like doppi dello stesso utente
LikeSchema.index({ user: 1, targetType: 1, targetId: 1 }, { unique: true })

// ⚡ Ottimizza conteggi per target
LikeSchema.index({ targetType: 1, targetId: 1 })

export default model("Like", LikeSchema)
