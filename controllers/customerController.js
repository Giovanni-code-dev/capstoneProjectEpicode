// controllers/customerController.js

import { getDashboardMessage } from "../services/dashboardService.js"
import { getUserProfile, updateUserProfile } from "../services/profileService.js"
import { getUserLocation, updateUserLocation } from "../services/locationService.js"

// Dashboard
export const getCustomerDashboard = async (req, res, next) => {
  try {
    const message = await getDashboardMessage(req, res, next)
    return message
  } catch (error) {
    next(error)
  }
}

// Profilo
export const getCustomerProfile = async (req, res, next) => {
  try {
    const profile = await getUserProfile(req, res, next)
    return profile
  } catch (error) {
    next(error)
  }
}

export const updateCustomerProfile = async (req, res, next) => {
  try {
    const updated = await updateUserProfile(req, res, next)
    return updated
  } catch (error) {
    next(error)
  }
}

// Geolocalizzazione
export const getCustomerLocation = async (req, res, next) => {
  try {
    const location = await getUserLocation(req, res, next)
    return location
  } catch (error) {
    next(error)
  }
}

export const updateCustomerLocation = async (req, res, next) => {
  try {
    const location = await updateUserLocation(req, res, next)
    return location
  } catch (error) {
    next(error)
  }
}
