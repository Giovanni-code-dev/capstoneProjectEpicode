import { Schema, model } from "mongoose"

const ProjectSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    location: { type: String }, // es. città, evento, spazio
    date: { type: Date },       // data dell’evento o progetto
    media: [
      {
        url: String,
        public_id: String,
        type: { type: String, enum: ["image", "video"], default: "image" },
        name: String // opzionale, per descrizione o titolo
      }
    ],
    collaborators: [{ type: String }],
    artist: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
)

export default model("Project", ProjectSchema)
