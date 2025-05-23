import express from "express"
import authRouter from "./auth.route.js"
// in futuro: import artistRouter from "./artist.route.js"
import artistRouter from "./artist.route.js"

import showRouter from "./show.route.js"

import packageRouter from "./package.route.js"

import projectRouter from "./project.route.js"



const router = express.Router()

// /auth → login, register
router.use("/auth", authRouter)

// router.use("/artists", artistRouter) ecc...
router.use("/artist", artistRouter)

router.use("/shows", showRouter)

router.use("/packages", packageRouter)

router.use("/projects", projectRouter)

export default router