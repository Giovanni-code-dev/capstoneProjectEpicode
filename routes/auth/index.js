import express from "express"
import artistAuthRouter from "./artist.route.js"
import customerAuthRouter from "./customer.route.js"
import adminAuthRouter from "./admin.route.js"
import googleOAuthRouter from "./googleOAuth.route.js"




// viewerAuthRouter e adminAuthRouter li aggiungeremo dopo

const router = express.Router()

router.use("/", googleOAuthRouter)

// Tutte le rotte per /auth/artist
router.use("/artist", artistAuthRouter)
//  (da aggiungere dopo)

// router.use("/customer", customerAuthRouter)
router.use("/customer", customerAuthRouter)
// (da aggiungere dopo)

// router.use("/admin", adminAuthRouter)
router.use("/admin", adminAuthRouter)


export default router
