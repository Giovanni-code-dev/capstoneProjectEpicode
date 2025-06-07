import { Schema, model } from "mongoose"
import bcrypt from "bcrypt"
import mongoose from "mongoose"

const ArtistSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      // Non mettiamo più "required"
    },

    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    name: {
      type: String,
      required: true,
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
        lng: { type: Number },
      },
    },

    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],

    theme: {
      primaryColor: { type: String, default: "#111827" },       // Testo, pulsanti
      backgroundColor: { type: String, default: "#ffffff" },     // Sfondo
      accentColor: { type: String, default: "#fbbf24" },         // Link, badge, bottoni secondari
      fontFamily: { type: String, default: "'Inter', sans-serif" }, // Font principale
      borderRadius: { type: String, default: "0.75rem" },        // es: '0.25rem', '0.5rem', '0.75rem'
      shadow: { type: String, default: "0 4px 12px rgba(0, 0, 0, 0.1)" }, // Shadow su card, modali
      fontSizeBase: { type: String, default: "1rem" },           // 1rem = 16px
      transitionStyle: { type: String, default: "ease-in-out" }, // Transizioni
    },
  },
  { timestamps: true }
)

//
//  Validazione personalizzata per obbligatorietà della password
//
ArtistSchema.pre("validate", function (next) {
  if (this.provider === "local" && !this.password) {
    this.invalidate("password", "La password è richiesta per i provider locali.")
  }
  next()
})

//  Hash della password solo se presente e modificata
ArtistSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password) {
    this.password = await bcrypt.hash(this.password, 10)
  }
  next()
})


// Metodo per confronto password al login
ArtistSchema.methods.comparePassword = function (plainPwd) {
  // Evita errore se la password non è impostata (es. account Google)
  if (!this.password) return false
  return bcrypt.compare(plainPwd, this.password)
}

export default model("Artist", ArtistSchema)
