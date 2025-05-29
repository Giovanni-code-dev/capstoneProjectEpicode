import mongoose from "mongoose"
import bcrypt from "bcrypt"

const adminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, default: "admin" }
  },
  { timestamps: true }
)

// Hash automatico della password
adminSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10)
  }
  next()
})

adminSchema.methods.isPasswordCorrect = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password)
}

const Admin = mongoose.model("Admin", adminSchema)
export default Admin
