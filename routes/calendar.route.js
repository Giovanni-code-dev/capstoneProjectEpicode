import express from "express"
import { JWTAuthMiddleware } from "../middleware/JWTAuthMiddleware.js"
import { artistOnly } from "../middleware/roleMiddleware.js"
import {
  getMyCalendar,
  addCalendarEntry,
  deleteCalendarEntry
} from "../controllers/calendarController.js"

const router = express.Router()

// Solo artisti loggati
router.use(JWTAuthMiddleware, artistOnly)

// Visualizza tutte le proprie date
router.get("/", getMyCalendar)

// Aggiunge una nuova voce (unavailable / available)
router.post("/", addCalendarEntry)

// Rimuove una voce dal calendario
router.delete("/:id", deleteCalendarEntry)

export default router
