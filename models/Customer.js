import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const customerSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, default: "customer" },

    avatar: { type: String },
    bio: { type: String },
    telefono: { type: String },

    website: { type: String },
    instagram: { type: String },
    facebook: { type: String },
    youtube: { type: String },
    portfolio: { type: String },
    tiktok: { type: String },

    categories: [{ type: String }],

    location: {
      city: { type: String },
      address: { type: String },
      coordinates: {
        lat: Number,
        lng: Number
      }
    }
  },
  { timestamps: true }
)

//  Hash della password prima del salvataggio
customerSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
  }
  next()
})

//  Metodo coerente per verifica password
customerSchema.methods.isPasswordCorrect = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

//  Metodo per generare token (opzionale)
customerSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { _id: this._id, model: "Customer" },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  )
}

const Customer = mongoose.model("Customer", customerSchema)
export default Customer
