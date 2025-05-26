import CalendarModel from "../models/CalendarEntry.js"
import createHttpError from "http-errors"

// Elenco date dell’artista
export const getMyCalendar = async (req, res, next) => {
  try {
    const entries = await CalendarModel.find({ artist: req.user._id }).sort({ date: 1 })
    res.json(entries)
  } catch (error) {
    next(error)
  }
}

// Aggiunta manuale di una data
export const addCalendarEntry = async (req, res, next) => {
  try {
    const { date, status, notes } = req.body

    const entry = new CalendarModel({
      artist: req.user._id,
      date,
      status,
      notes,
    })

    const saved = await entry.save()
    res.status(201).json(saved)
  } catch (error) {
    next(error)
  }
}

//  Rimozione voce calendario
export const deleteCalendarEntry = async (req, res, next) => {
    try {
      const deleted = await CalendarModel.findOneAndDelete({
        _id: req.params.id,
        artist: req.user._id,
      })
  
      if (!deleted) throw createHttpError(404, "Data non trovata o non autorizzato")
  
      const formattedDate = new Date(deleted.date).toLocaleDateString("it-IT", {
        day: "2-digit",
        month: "long",
        year: "numeric"
      })
  
      // Log in console
      console.log(`Calendario: ${req.user.name || req.user.email} ha rimosso la data del ${formattedDate}`)
  
      res.status(200).json({
        message: `La data del ${formattedDate} è stata rimossa dal calendario.`,
        deletedId: deleted._id
      })
    } catch (error) {
      next(error)
    }
  }
  
