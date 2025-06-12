// services/locationService.js

import createHttpError from "http-errors"
import { getCoordinatesFromAddress } from "../utils/geocoding.js"

import Artist from "../models/Artist.js"
import Customer from "../models/Customer.js"
import Admin from "../models/Admin.js"

/**
 * Restituisce il modello Mongoose corrispondente al tipo utente
 * @param {string} type - Tipo utente (Artist, Customer, Admin)
 * @returns {Mongoose.Model}
 */
const getModelByUserType = (type) => {
  switch (type) {
    case "Artist":
      return Artist
    case "Customer":
      return Customer
    case "Admin":
      return Admin
    default:
      throw new Error("Tipo utente sconosciuto")
  }
}

/**
 * Aggiorna la posizione (city, address, coordinates) dell'utente loggato
 * Utilizza il servizio di geocoding per calcolare lat/lng da city + address
 * @route PUT /update-location
 */
export const updateUserLocation = async (req, res, next) => {
  try {
    const { city, address } = req.body

    if (!city || !address) {
      throw createHttpError(400, "City e address sono obbligatori")
    }

    //  Ottieni lat/lng + city reale da Google
    const geo = await getCoordinatesFromAddress(city, address)

    const Model = getModelByUserType(req.userType)

    const updatedUser = await Model.findByIdAndUpdate(
      req.user._id,
      {
        location: {
          city: geo.city, //  importante
          address,
          coordinates: {
            lat: geo.lat,
            lng: geo.lng
          }
        }
      },
      { new: true }
    )

    if (!updatedUser) {
      throw createHttpError(404, "Utente non trovato")
    }

    res.json({
      message: "Posizione aggiornata con successo!",
      location: updatedUser.location
    })
  } catch (error) {
    console.error("Errore updateUserLocation:", error)
    next(error)
  }
}


/**
 * Restituisce la posizione corrente dell’utente loggato
 * @route GET /location
 */
export const getUserLocation = async (req, res, next) => {
  try {
    const Model = getModelByUserType(req.userType)

    const user = await Model.findById(req.user._id).select("location")

    if (!user || !user.location) {
      throw createHttpError(404, "Posizione non trovata.")
    }

    res.json({ location: user.location })
  } catch (error) {
    next(error)
  }
}
