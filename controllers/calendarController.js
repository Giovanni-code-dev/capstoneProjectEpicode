import CalendarModel from "../models/CalendarEntry.js"
import createHttpError from "http-errors"

// Recupera il calendario dell’artista
export const getMyCalendar = async (req, res, next) => {
  try {
    const entries = await CalendarModel.find({ artist: req.user._id }).sort({ date: 1 })
    res.json(entries)
  } catch (error) {
    next(error)
  }
}

// Aggiunge una nuova data
export const addCalendarEntry = async (req, res, next) => {
  try {
    const { date, status, notes } = req.body

    // 🔍 Validazione campi richiesti
    if (!date) throw createHttpError(400, "La data è obbligatoria.")
    if (!["available", "unavailable", "booked"].includes(status)) {
      throw createHttpError(400, "Lo stato del calendario non è valido.")
    }

    const entry = new CalendarModel({
      artist: req.user._id,
      date,
      status,
      notes
    })

    const saved = await entry.save()
    res.status(201).json(saved)
  } catch (error) {
    // 🛡️ Gestione errore duplicato (es. data già presente)
    if (error.code === 11000) {
      return next(createHttpError(409, "Hai già inserito una voce per questa data."))
    }
    next(error)
  }
}

// Elimina una voce del calendario
export const deleteCalendarEntry = async (req, res, next) => {
  try {
    const deleted = await CalendarModel.findOneAndDelete({
      _id: req.params.id,
      artist: req.user._id
    })

    if (!deleted) throw createHttpError(404, "Data non trovata o non autorizzato")

    const formattedDate = new Date(deleted.date).toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    })

    console.log(`Calendario: ${req.user.name || req.user.email} ha rimosso la data del ${formattedDate}`)

    res.status(200).json({
      message: `La data del ${formattedDate} è stata rimossa dal calendario.`,
      deletedId: deleted._id
    })
  } catch (error) {
    next(error)
  }
}
