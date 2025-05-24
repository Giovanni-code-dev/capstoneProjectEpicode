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
    location: {
      city: { type: String, required: true },
      address: { type: String, required: true },
      coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
      }
    },
    role: {
      type: String,
      enum: ["admin", "artist", "viewer"], // ✅ aggiunto
      default: "viewer",
    }
  },
  { timestamps: true }
)

// 🔐 Hash della password prima del salvataggio
UserSchema.pre("save", async function (next) {
  const user = this

  if (user.isModified("password")) {
    const hash = await bcrypt.hash(user.password, 10)
    user.password = hash
  }

  next()
})

// 🔍 Metodo per confrontare password in fase di login
UserSchema.methods.isPasswordCorrect = function (plainPwd) {
  return bcrypt.compare(plainPwd, this.password)
}

export default model("User", UserSchema)
