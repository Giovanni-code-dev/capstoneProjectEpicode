import express from "express"
const router = express.Router()

// 🔐 Autenticazione
import authRouter from "./auth/index.js" // router multiplo: /auth/artist, /auth/viewer, ...
import authGoogleRouter from "./authGoogle.route.js"

// 👤 Profili e accesso
import adminRouter from "./admin.route.js"
import artistRouter from "./artist.route.js"
import viewerRouter from "./viewer.route.js"

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

router.use("/auth", authRouter)             // /auth/artist, /auth/viewer, /auth/admin
router.use("/auth", authGoogleRouter)       // /auth/google

router.use("/admin", adminRouter)
router.use("/artist", artistRouter)
router.use("/viewer", viewerRouter)

router.use("/shows", showRouter)
router.use("/packages", packageRouter)
router.use("/projects", projectRouter)

router.use("/requests", requestRouter)
router.use("/calendar", calendarRouter)

router.use("/reviews", reviewRouter)
router.use("/likes", likeRouter)
router.use("/stats", statsRouter)

export default router
