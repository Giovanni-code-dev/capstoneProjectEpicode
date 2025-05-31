// routes/stats.route.js

import express from "express"
import { getArtistStats } from "../controllers/statsController.js"

const router = express.Router()

// =====================================================
// Rotte Statistiche
// =====================================================

// Recupera le statistiche pubbliche o interne di un artista specifico
// Route di esempio: GET /stats/artist/:artistId
router.get("/artist/:artistId", getArtistStats)

export default router
