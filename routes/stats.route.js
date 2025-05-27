// /routes/stats.route.js

import express from "express"
import { getArtistStats } from "../controllers/statsController.js"

const router = express.Router()

// Es: GET /stats/artist/:artistId
router.get("/artist/:artistId", getArtistStats)

export default router


