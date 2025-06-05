import express from "express"
import passport from "../../strategies/google.strategy.js"

const router = express.Router()

// Avvia l'autenticazione Google con il ruolo corretto
const startGoogleOAuth = (role) =>
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
    state: role, // il "ruolo" viene passato nello state
  })

// Gestisce la risposta di Google
const handleGoogleCallback = () =>
  passport.authenticate("google", { session: false })

// Redirect con token per ARTISTA
router.get("/google/artist", startGoogleOAuth("artist"))
router.get("/google/artist/callback", handleGoogleCallback(), (req, res) => {
  const token = req.user.token
  const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173"
  res.redirect(`${frontendURL}/auth/google/callback?token=${token}`)
})

// Redirect con token per CUSTOMER
router.get("/google/customer", startGoogleOAuth("customer"))
router.get("/google/customer/callback", handleGoogleCallback(), (req, res) => {
  const token = req.user.token
  const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173"
  res.redirect(`${frontendURL}/auth/google/callback?token=${token}`)
})

export default router
