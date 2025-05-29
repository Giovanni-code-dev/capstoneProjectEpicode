import { Schema, model } from "mongoose"
import bcrypt from "bcrypt"

const ArtistSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    avatar: { type: String, trim: true },
    bio: { type: String, trim: true },
    telefono: { type: String, trim: true },
    website: { type: String, trim: true },
    instagram: { type: String, trim: true },
    facebook: { type: String, trim: true },
    youtube: { type: String, trim: true },
    portfolio: { type: String, trim: true },
    tiktok: { type: String, trim: true },
    location: {
      city: { type: String },
      address: { type: String },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number }
      }
    },
    categories: {
      type: [String],
      enum: ["danza aerea", "trampoli", "giocoleria", "mimo", "fuoco", "altro"],
      default: []
    }
  },
  { timestamps: true }
)

// Hash della password prima del salvataggio
ArtistSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10)
  }
  next()
})

// Metodo per controllare la password al login
ArtistSchema.methods.isPasswordCorrect = function (plainPwd) {
  return bcrypt.compare(plainPwd, this.password)
}

export default model("Artist", ArtistSchema)
