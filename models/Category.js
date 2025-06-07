import mongoose from "mongoose"

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    icon: { type: String }, // (facoltativo) emoji o classname CSS
  },
  { timestamps: true }
)

export default mongoose.model("Category", categorySchema)
