// Configura variabili ambiente
import dotenv from "dotenv"
dotenv.config()

// Import Google OAuth Strategy
import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"

// JWT generator
import { createAccessToken } from "../tools/jwtTools.js"

// Modelli utente
import ArtistModel from "../models/Artist.js"
import CustomerModel from "../models/Customer.js"

// Configurazione della strategia Google OAuth
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true, //  Necessario per leggere req.query.state
    },
    async (req, accessToken, refreshToken, profile, cb) => {
      try {
        const email = profile.emails[0].value
        const displayName = profile.displayName
        const avatar = profile.photos?.[0]?.value || ""
        const role = req.query.state || "customer" //  Ruolo: artist o customer

        let Model

        // Seleziona il modello corretto
        if (role === "artist") {
          Model = ArtistModel
        } else if (role === "customer") {
          Model = CustomerModel
        } else {
          return cb(new Error("Ruolo OAuth non valido"))
        }

        // Cerca l'utente esistente
        let user = await Model.findOne({ email })

        if (user) {
          console.log(`⚠️ Login Google: utente già registrato come ${role} → ${email}`)
        } else {
          // Crea nuovo utente
          console.log(`Registrazione Google come ${role} → ${email}`)
          user = await Model.create({
            email,
            name: displayName,
            avatar,
            password: "google-oauth", // ⚠️ Placeholder, non usato
            location: {
              city: "da completare",
              address: "da completare",
              coordinates: { lat: 0, lng: 0 },
            },
          })
        }

        // Genera JWT completo
        const token = await createAccessToken({
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role,
          model: role === "artist" ? "Artist" : "Customer",
        })

        return cb(null, { token })
      } catch (error) {
        return cb(error)
      }
    }
  )
)

export default passport
