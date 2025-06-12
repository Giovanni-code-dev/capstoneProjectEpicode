// Configura variabili ambiente
import dotenv from "dotenv"
dotenv.config()

import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import { createAccessToken } from "../tools/jwtTools.js"
import ArtistModel from "../models/Artist.js"
import CustomerModel from "../models/Customer.js"

import crypto from "crypto" // usiamo questo per generare una password casuale

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value
        const displayName = profile.displayName
        const avatar = profile.photos?.[0]?.value || ""

        const state = req.query?.state || "customer"
        const isRegister = state.startsWith("register")
        const role = isRegister ? state.split("-")[1] : state

        console.log(` Google OAuth ${isRegister ? "registrazione" : "login"} in corso - ruolo: ${role}, email: ${email}`)

        let Model
        if (role === "artist") Model = ArtistModel
        else if (role === "customer") Model = CustomerModel
        else return done(new Error("Ruolo OAuth non valido"))

        let user = await Model.findOne({ email })

        if (!user && isRegister) {
          user = await Model.create({
            email,
            name: displayName,
            avatar,
            provider: "google", // 👈 Imposta il provider
            password: crypto.randomUUID(), // 👈 Placeholder sicuro per evitare errori mongoose
          })
          console.log(` Nuovo ${role} creato → ${email}`)
        }

        if (!user) {
          console.log(` Login fallito: nessun ${role} trovato per ${email}`)
          return done(null, false)
        }

        console.log(" Utente trovato o appena creato:", user) //  NUOVO LOG INSERITO QUI

        const token = await createAccessToken({
          _id: user._id,
          name: user.name,
          email,
          avatar,
          role,
          model: role === "artist" ? "Artist" : "Customer",
        })

        return done(null, { token })
      } catch (error) {
        console.error("Errore OAuth interno:", error)
        return done(error)
      }
    }
  )
)

export default passport
