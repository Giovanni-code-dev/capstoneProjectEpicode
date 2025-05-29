import express from "express"
import artistAuthRouter from "./artist.route.js"
// viewerAuthRouter e adminAuthRouter li aggiungeremo dopo

const router = express.Router()

// 🎭 Tutte le rotte per /auth/artist
router.use("/artist", artistAuthRouter)

// 👁️‍🗨️ (da aggiungere dopo)
// router.use("/viewer", viewerAuthRouter)
// 🛡️ (da aggiungere dopo)
// router.use("/admin", adminAuthRouter)

export default router
