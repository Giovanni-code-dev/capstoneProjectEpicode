import express from "express"
const router = express.Router()

// 🔐 Autenticazione
import authRouter from "./auth/index.js"
import authGoogleRouter from "./authGoogle.route.js"

// 👤 Profili e accesso
import adminRouter from "./admin.route.js"
import artistRouter from "./artist.route.js"
import customerRouter from "./customer.route.js"  // ✅ Cambiato

// 🎭 Contenuti artistici
import showRouter from "./show.route.js"
import packageRouter from "./package.route.js"
import projectRouter from "./project.route.js"

// 💬 Interazioni
import requestRouter from "./request.route.js"
import reviewRouter from "./review.route.js"
import likeRouter from "./like.route.js"
import calendarRouter from "./calendar.route.js"
import statsRouter from "./stats.route.js"

// ✅ Ordine corretto dei router.use()

router.use("/auth", authRouter)
router.use("/auth", authGoogleRouter)

router.use("/admin", adminRouter)
router.use("/artist", artistRouter)
router.use("/customer", customerRouter) // ✅ Aggiornato

router.use("/shows", showRouter)
router.use("/packages", packageRouter)
router.use("/projects", projectRouter)

router.use("/requests", requestRouter)
router.use("/calendar", calendarRouter)

router.use("/reviews", reviewRouter)
router.use("/likes", likeRouter)
router.use("/stats", statsRouter)

export default router
