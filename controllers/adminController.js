
import UserModel from "../models/User.js"
import RequestModel from "../models/Request.js"
import { getDashboardMessage } from "../services/dashboardService.js"
import { getUserProfile, updateUserProfile } from "../services/profileService.js"

export const getAdminDashboard = async (req, res, next) => {
    try {
        const message = await getDashboardMessage(req, res, next)
        return message // il servizio invia già la risposta
    } catch (error) {
        next(error)
    }
}

export const getAdminProfile = async (req, res, next) => {
    try {
        const profile = await getUserProfile(req, res, next)
        return profile
    } catch (error) {
        next(error)
    }
}

export const updateAdminProfile = async (req, res, next) => {
    try {
        const updated = await updateUserProfile(req, res, next)
        return updated
    } catch (error) {
        next(error)
    }
}

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await UserModel.find().select("-password")
        res.json(users)
    } catch (error) {
        next(error)
    }
}

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
