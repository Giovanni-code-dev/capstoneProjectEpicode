import { Schema, model } from "mongoose"
import bcrypt from "bcrypt"

const UserSchema = new Schema(
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
      required: true,
    },
    name: {
      type: String,
    },
    avatar: {
      type: String,
      trim: true
    },
    bio: {
      type: String,
      trim: true
    },
    telefono: {
      type: String,
      trim: true
    },
    website: {
      type: String,
      trim: true
    },
    instagram: {
      type: String,
      trim: true
    },
    facebook: {
      type: String,
      trim: true
    },
    youtube: {
      type: String,
      trim: true
    },
    portfolio: {
      type: String,
      trim: true
    },
    tiktok: {
      type: String,
      trim: true
    },
    location: {
      city: { type: String, required: true },
      address: { type: String, required: true },
      coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
      }
    },
    categories: {
      type: [String],
      enum: ["danza aerea", "trampoli", "giocoleria", "mimo", "fuoco", "altro"],
      default: []
    },
    role: {
      type: String,
      enum: ["admin", "artist", "Customer"],
      default: "Customer",
    }
  },
  { timestamps: true }
)

// Hash della password prima del salvataggio
UserSchema.pre("save", async function (next) {
  const user = this

  if (user.isModified("password")) {
    const hash = await bcrypt.hash(user.password, 10)
    user.password = hash
  }

  next()
})

// Metodo per confrontare password in fase di login
UserSchema.methods.isPasswordCorrect = function (plainPwd) {
  return bcrypt.compare(plainPwd, this.password)
}

export default model("User", UserSchema)
