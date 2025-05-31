import UserModel from "../models/User.js"
import RequestModel from "../models/Request.js"
import { getDashboardMessage } from "../services/dashboardService.js"
import { getUserProfile, updateUserProfile } from "../services/profileService.js"

//
// Admin Dashboard
//

/**
 * GET /admin/dashboard
 * Restituisce un messaggio riepilogativo per la dashboard dell’admin.
 * Il messaggio è costruito da un servizio dedicato.
 */
export const getAdminDashboard = async (req, res, next) => {
  try {
    const message = await getDashboardMessage(req, res, next)
    return message // Il servizio gestisce già la risposta
  } catch (error) {
    next(error)
  }
}

//
// Profilo Admin
//

/**
 * GET /admin/me
 * Recupera il profilo dell’admin attualmente autenticato.
 */
export const getAdminProfile = async (req, res, next) => {
  try {
    const profile = await getUserProfile(req, res, next)
    return profile
  } catch (error) {
    next(error)
  }
}

/**
 * PUT /admin/me
 * Aggiorna i dati del profilo dell’admin attualmente autenticato.
 */
export const updateAdminProfile = async (req, res, next) => {
  try {
    const updated = await updateUserProfile(req, res, next)
    return updated
  } catch (error) {
    next(error)
  }
}

//
// Gestione utenti
//

/**
 * GET /admin/users
 * Recupera la lista di tutti gli utenti registrati (admin, artisti, customer),
 * escludendo i campi sensibili come la password.
 */
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await UserModel.find().select("-password")
    res.json(users)
  } catch (error) {
    next(error)
  }
}

//
// Gestione richieste
//

/**
 * GET /admin/requests?status=...
 * Recupera tutte le richieste presenti nel sistema,
 * con popolamento dei riferimenti a customer, artist, packages e shows.
 * È possibile filtrare per stato tramite query param (?status=pending).
 */
export const getAllRequests = async (req, res, next) => {
  try {
    const { status } = req.query
    const query = status ? { status } : {}

    const requests = await RequestModel.find(query)
      .populate("customer", "email name")
      .populate("artist", "email name")
      .populate("packages", "title")
      .populate("shows", "title")
      .sort({ createdAt: -1 })

    res.json(requests)
  } catch (error) {
    next(error)
  }
}
