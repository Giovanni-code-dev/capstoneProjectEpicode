// controllers/artistController.js

import { getDashboardMessage } from "../services/dashboardService.js"
import {
  getPublicArtistProfile,
  searchArtistsByFilters,
  getHighlightedArtists
} from "../services/artistService.js"
import { getUserProfile, updateUserProfile } from "../services/profileService.js"
import { getUserLocation, updateUserLocation } from "../services/locationService.js"

//
// Dashboard Artist
//

/**
 * GET /artist/dashboard
 * Restituisce i dati di riepilogo per la dashboard personale dell’artista.
 */
export const getArtistDashboard = async (req, res, next) => {
  try {
    const result = await getDashboardMessage(req, res, next)
    return result // Il servizio gestisce direttamente la risposta
  } catch (error) {
    next(error)
  }
}

//
// Profilo Personale Artist
//

/**
 * GET /artist/me
 * Restituisce i dati del profilo dell’artista autenticato.
 */
export const getArtistProfile = async (req, res, next) => {
  try {
    const result = await getUserProfile(req, res, next)
    return result
  } catch (error) {
    next(error)
  }
}

/**
 * PUT /artist/me
 * Permette all’artista autenticato di aggiornare il proprio profilo.
 */
export const updateArtistProfile = async (req, res, next) => {
  try {
    const result = await updateUserProfile(req, res, next)
    return result
  } catch (error) {
    next(error)
  }
}

//
// Posizione Artist
//

/**
 * GET /artist/me/location
 * Restituisce la posizione (city/address + coordinate) dell’artista autenticato.
 */
export const getArtistLocation = async (req, res, next) => {
  try {
    const result = await getUserLocation(req, res, next)
    return result
  } catch (error) {
    next(error)
  }
}

/**
 * PUT /artist/me/location
 * Aggiorna la posizione dell’artista e ne calcola lat/lng tramite Geocoding.
 */
export const updateArtistLocation = async (req, res, next) => {
  try {
    const result = await updateUserLocation(req, res, next)
    return result
  } catch (error) {
    next(error)
  }
}

//
// Rotte Pubbliche (visibili da utenti esterni)
//

/**
 * GET /artist/public/:id
 * Restituisce il profilo pubblico dell’artista specificato.
 */
export const getPublicArtist = async (req, res, next) => {
  try {
    const result = await getPublicArtistProfile(req, res, next)
    return result
  } catch (error) {
    next(error)
  }
}

/**
 * GET /artist/public?city=...&category=...
 * Filtra artisti pubblici in base a city, category, date e nome.
 */
export const searchArtists = async (req, res, next) => {
  try {
    const result = await searchArtistsByFilters(req, res, next)
    return result
  } catch (error) {
    next(error)
  }
}

/**
 * GET /artist/public/highlighted
 * Restituisce un elenco di artisti selezionati per la home page.
 */
export const getHighlighted = async (req, res, next) => {
  try {
    const result = await getHighlightedArtists(req, res, next)
    return result
  } catch (error) {
    next(error)
  }
}
