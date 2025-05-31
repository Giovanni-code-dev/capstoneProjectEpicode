// controllers/customerController.js

import { getDashboardMessage } from "../services/dashboardService.js"
import { getUserProfile, updateUserProfile } from "../services/profileService.js"
import { getUserLocation, updateUserLocation } from "../services/locationService.js"

//
// Dashboard Customer
//

/**
 * GET /customer/dashboard
 * Restituisce i dati di riepilogo per la dashboard del customer autenticato.
 */
export const getCustomerDashboard = async (req, res, next) => {
  try {
    const message = await getDashboardMessage(req, res, next)
    return message // La risposta viene gestita direttamente dal servizio
  } catch (error) {
    next(error)
  }
}

//
// Profilo Customer
//

/**
 * GET /customer/me
 * Restituisce il profilo del customer autenticato.
 */
export const getCustomerProfile = async (req, res, next) => {
  try {
    const profile = await getUserProfile(req, res, next)
    return profile
  } catch (error) {
    next(error)
  }
}

/**
 * PUT /customer/me
 * Permette al customer autenticato di aggiornare i dati del proprio profilo.
 */
export const updateCustomerProfile = async (req, res, next) => {
  try {
    const updated = await updateUserProfile(req, res, next)
    return updated
  } catch (error) {
    next(error)
  }
}

//
// Geolocalizzazione Customer
//

/**
 * GET /customer/me/location
 * Restituisce l'indirizzo e le coordinate geografiche del customer autenticato.
 */
export const getCustomerLocation = async (req, res, next) => {
  try {
    const location = await getUserLocation(req, res, next)
    return location
  } catch (error) {
    next(error)
  }
}

/**
 * PUT /customer/me/location
 * Aggiorna la location del customer e ne calcola automaticamente latitudine e longitudine.
 */
export const updateCustomerLocation = async (req, res, next) => {
  try {
    const location = await updateUserLocation(req, res, next)
    return location
  } catch (error) {
    next(error)
  }
}
