// controllers/artistController.js
import ArtistModel from "../models/Artist.js"
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


// PATCH /artist/me/theme rotta per aggiornare il tema dell'artista
export const updateArtistTheme = async (req, res, next) => {
  try {
    const { primaryColor, backgroundColor, fontFamily } = req.body

    console.log("Richiesta aggiornamento tema con:", {
      primaryColor,
      backgroundColor,
      fontFamily,
    })

    const updatedArtist = await ArtistModel.findByIdAndUpdate(
      req.user._id,
      {
        theme: {
          primaryColor,
          backgroundColor,
          fontFamily,
        },
      },
      { new: true }
    )

    if (!updatedArtist) {
      console.log(" Artista non trovato per update theme")
      return res.status(404).json({ message: "Artista non trovato" })
    }

    console.log(" Tema aggiornato correttamente per artista:", updatedArtist._id)
    res.json(updatedArtist)
  } catch (error) {
    console.error(" Errore durante updateArtistTheme:", error)
    next(error)
  }
}




/**
 * Restituisce tutti gli artisti registrati
 * (escludendo campi sensibili come password)
 */
export const getAllArtists = async (req, res, next) => {
  try {
    const artists = await ArtistModel.find({}, "-password -__v")
    res.json(artists)
  } catch (error) {
    next(error)
  }
}



export const getArtistCities = async (req, res, next) => {
  try {
    const { search } = req.query

    const artists = await ArtistModel.find({}, "location.city")
    let cities = artists
      .map(a => a.location?.city?.trim())
      .filter(Boolean) // rimuove undefined/null

    // Rimuovi duplicati
    cities = [...new Set(cities)]

    // Filtro per input utente (es. ?search=r)
    if (search) {
      const searchLower = search.toLowerCase()
      cities = cities.filter(city => city.toLowerCase().startsWith(searchLower))
    }

    res.json(cities)
  } catch (error) {
    next(error)
  }
}

