import express from "express"
import passport from "../../strategies/google.strategy.js"

const router = express.Router()

// 🔁 Funzione per avviare OAuth con il ruolo giusto
const startGoogleOAuth = (role) =>
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
    state: role,
  })

// 🔁 Middleware per gestire il callback
const handleGoogleCallback = () =>
  passport.authenticate("google", { session: false })

// 🎭 Login / Registrazione come ARTISTA
router.get("/google/artist", startGoogleOAuth("artist"))
router.get("/google/artist/callback", handleGoogleCallback(), (req, res) => {
  res.json({
    message: "Login artista con Google riuscito",
    token: req.user.token,
  })
})

// 👤 Login / Registrazione come CUSTOMER
router.get("/google/customer", startGoogleOAuth("customer"))
router.get("/google/customer/callback", handleGoogleCallback(), (req, res) => {
  res.json({
    message: "Login cliente con Google riuscito",
    token: req.user.token,
  })
})

export default router
