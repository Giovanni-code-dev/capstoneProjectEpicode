import express from "express"
const router = express.Router() // ✅ Deve venire prima di ogni router.use()

import authRouter from "./auth.route.js"
import authGoogleRouter from "./authGoogle.route.js"
import artistRouter from "./artist.route.js"
import showRouter from "./show.route.js"
import packageRouter from "./package.route.js"
import projectRouter from "./project.route.js"
import viewerRouter from "./viewer.route.js"
import adminRouter from "./admin.route.js"
import requestRouter from "./request.route.js"
import calendarRouter from "./calendar.route.js"
import likeRouter from "./like.route.js" // Importa il router
import statsRouter from "./stats.route.js"

import reviewRouter from "./review.route.js"


// ✅ Ordine corretto dei router.use()

// /auth → login, register
router.use("/auth", authRouter)
router.use("/auth", authGoogleRouter)
router.use("/likes", likeRouter) // ✅ ATTIVA LE ROTTE LIKE

// /admin → profilo admin
router.use("/admin", adminRouter)

// /artist → profilo artista
router.use("/artist", artistRouter)

// /viewer → profilo viewer
router.use("/viewer", viewerRouter)

// /shows → spettacoli
router.use("/shows", showRouter)

// /packages → pacchetti
router.use("/packages", packageRouter)

// /projects → progetti speciali
router.use("/projects", projectRouter)

// /requests → richieste
router.use("/requests", requestRouter)

// /calendar → calendario
router.use("/calendar", calendarRouter)


router.use("/reviews", reviewRouter)


router.use("/stats", statsRouter)

export default router
