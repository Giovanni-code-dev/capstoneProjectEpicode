import express from "express"
import passport from "../strategies/google.strategy.js"

const router = express.Router()

// Inizio login con Google
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }))

// Callback dopo il login
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    // Per ora mostriamo il token in JSON
    res.json({
      message: "Login con Google avvenuto con successo!",
      token: req.user.token
    })
  }
)

export default router
