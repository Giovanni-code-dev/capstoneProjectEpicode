import dotenv from "dotenv"
dotenv.config()
import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import UserModel from "../models/User.js"
import { createAccessToken } from "../tools/jwtTools.js"

console.log("🔍 DEBUG ENV", {
  clientID: process.env.GOOGLE_CLIENT_ID,
  secret: process.env.GOOGLE_CLIENT_SECRET,
  callback: process.env.GOOGLE_CALLBACK_URL
})

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        const existing = await UserModel.findOne({ email: profile.emails[0].value })

        if (existing) {
          const token = await createAccessToken({ _id: existing._id, role: existing.role })
          return cb(null, { token })
        }

        const newUser = new UserModel({
          email: profile.emails[0].value,
          name: profile.displayName,
          password: "google-oauth",
          role: "viewer",
          location: {
            city: "da completare",
            address: "da completare",
            coordinates: { lat: 0, lng: 0 }
          }
        })

        await newUser.save()

        const token = await createAccessToken({ _id: newUser._id, role: newUser.role })
        return cb(null, { token })
      } catch (error) {
        return cb(error)
      }
    }
  )
)

export default passport
