// controllers/artistController.js

import { getDashboardMessage } from "../services/dashboardService.js"
import {
  getPublicArtistProfile,
  searchArtistsByFilters,
  getHighlightedArtists
} from "../services/artistService.js"
import { getUserProfile, updateUserProfile } from "../services/profileService.js"
import { getUserLocation, updateUserLocation } from "../services/locationService.js"

// Dashboard
export const getArtistDashboard = async (req, res, next) => {
  try {
    const result = await getDashboardMessage(req, res, next)
    return result
  } catch (error) {
    next(error)
  }
}

// Profilo
export const getArtistProfile = async (req, res, next) => {
  try {
    const result = await getUserProfile(req, res, next)
    return result
  } catch (error) {
    next(error)
  }
}

export const updateArtistProfile = async (req, res, next) => {
  try {
    const result = await updateUserProfile(req, res, next)
    return result
  } catch (error) {
    next(error)
  }
}

// Location
export const getArtistLocation = async (req, res, next) => {
  try {
    const result = await getUserLocation(req, res, next)
    return result
  } catch (error) {
    next(error)
  }
}

export const updateArtistLocation = async (req, res, next) => {
  try {
    const result = await updateUserLocation(req, res, next)
    return result
  } catch (error) {
    next(error)
  }
}

// Rotte pubbliche
export const getPublicArtist = async (req, res, next) => {
  try {
    const result = await getPublicArtistProfile(req, res, next)
    return result
  } catch (error) {
    next(error)
  }
}

export const searchArtists = async (req, res, next) => {
  try {
    const result = await searchArtistsByFilters(req, res, next)
    return result
  } catch (error) {
    next(error)
  }
}

export const getHighlighted = async (req, res, next) => {
  try {
    const result = await getHighlightedArtists(req, res, next)
    return result
  } catch (error) {
    next(error)
  }
}
