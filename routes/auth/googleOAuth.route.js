import express from "express"
import passport from "../../strategies/google.strategy.js"

const router = express.Router()

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173"

// Avvia l'autenticazione Google con il ruolo corretto (login o registrazione)
const startGoogleOAuth = (role) =>
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
    state: role, // "artist", "customer", "register-artist", "register-customer"
  })

// Callback di Google con verifica login riuscito
const handleGoogleCallback = () =>
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${FRONTEND_URL}/auth/google/callback?error=unauthorized`,
  })

//  Callback finale: controlla req.user e redirige con token o errore
const finalizeLogin = (req, res) => {
  if (!req.user || !req.user.token) {
    return res.redirect(`${FRONTEND_URL}/auth/google/callback?error=unauthorized`)
  }

  const token = req.user.token
  res.redirect(`${FRONTEND_URL}/auth/google/callback?token=${token}`)
}

// === Rotte per LOGIN con Google ===
router.get("/google/artist", startGoogleOAuth("artist"))
router.get("/google/artist/callback", handleGoogleCallback(), finalizeLogin)

router.get("/google/customer", startGoogleOAuth("customer"))
router.get("/google/customer/callback", handleGoogleCallback(), finalizeLogin)

// === Rotte per REGISTRAZIONE con Google ===
router.get("/google/register/artist", startGoogleOAuth("register-artist"))
router.get("/google/register/artist/callback", handleGoogleCallback(), finalizeLogin)

router.get("/google/register/customer", startGoogleOAuth("register-customer"))
router.get("/google/register/customer/callback", handleGoogleCallback(), finalizeLogin)

export default router
