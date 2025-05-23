/**
 * authController.js
 *
 * Questo file contiene le logiche per la gestione degli utenti:
 * - registrazione (register)
 * - login (login)
 * 
 * - register(req, res):
 *   Riceve email, password, nome, ruolo.
 *   Verifica che l’email non sia già registrata.
 *   Crea un nuovo utente, salva nel DB, e restituisce messaggio di successo.
 * 
 * - login(req, res):
 *   Riceve email e password.
 *   Verifica che esista l’utente e che la password sia corretta.
 *   Se tutto è ok, genera un token JWT contenente _id e ruolo, e lo restituisce.
 * 
 * Questo controller è collegato alle route: POST /auth/register e POST /auth/login
 */

import UserModel from "../models/User.js"
import createHttpError from "http-errors"
import { createAccessToken } from "../tools/jwtTools.js"

export const register = async (req, res, next) => {
  try {
    const { email, password, name, role } = req.body

    // Verifica se l'email è già registrata
    const existingUser = await UserModel.findOne({ email })
    if (existingUser) {
      throw createHttpError(409, "Email già registrata.")
    }

    // Crea e salva il nuovo utente
    const newUser = new UserModel({ email, password, name, role })
    await newUser.save()

    res.status(201).json({
      message: "Utente registrato con successo",
      userId: newUser._id,
    })
  } catch (error) {
    next(error)
  }
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const user = await UserModel.findOne({ email })
    if (!user) {
      throw createHttpError(401, "Credenziali non valide.")
    }

    const isMatch = await user.isPasswordCorrect(password)
    if (!isMatch) {
      throw createHttpError(401, "Credenziali non valide.")
    }

    // Genera il token JWT
    const accessToken = await createAccessToken({
      _id: user._id,
      role: user.role,
    })

    res.status(200).json({ accessToken })
  } catch (error) {
    next(error)
  }
}
