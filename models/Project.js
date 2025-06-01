import { Schema, model } from "mongoose"

const ProjectSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    location: { type: String }, // es. città, evento, spazio
    date: { type: Date },       // data dell’evento o progetto
    images: [{ url: String, public_id: String, isCover: { type: Boolean, default: false } }],
    collaborators: [{ type: String }],
    artist: {
      type: Schema.Types.ObjectId,
      ref: "Artist",
    }
  },
  { timestamps: true }
)

export default model("Project", ProjectSchema)
