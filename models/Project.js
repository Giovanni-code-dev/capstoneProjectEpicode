import { Schema, model } from "mongoose"

const ProjectSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    location: { type: String },         // es. città, evento, spazio
    date: { type: Date },               // data dell’evento o progetto
    media: [{ type: String }],          // immagini o video (Cloudinary o URL)
    collaborators: [{ type: String }],  // nomi o ruoli dei collaboratori
    artist: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
)

export default model("Project", ProjectSchema)