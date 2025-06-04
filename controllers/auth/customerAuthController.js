import Customer from "../../models/Customer.js"
import createHttpError from "http-errors"
import { createAccessToken } from "../../tools/jwtTools.js"

// REGISTRAZIONE
export const registerCustomer = async (req, res, next) => {
  try {
    const { email, password, name } = req.body

    const existing = await Customer.findOne({ email })
    if (existing) {
      console.log("Registrazione bloccata: email già presente per customer:", email)
      throw createHttpError(409, "Utente già registrato come customer")
    }
    const newCustomer = new Customer({ email, password, name })
    await newCustomer.save()

    const token = await createAccessToken({
      _id: newCustomer._id,
      role: "customer",
      name: newCustomer.name,
      email: newCustomer.email,
      avatar: newCustomer.avatar,
      model: "Customer"
    })

    res.status(201).json({
      message: "Registrazione avvenuta con successo",
      token,
      customer: {
        _id: newCustomer._id,
        name: newCustomer.name,
        email: newCustomer.email
      }
    })
    
  } catch (error) {
    next(error)
  }
}

// LOGIN
export const loginCustomer = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const customer = await Customer.findOne({ email })
    if (!customer) throw createHttpError(404, "Customer non trovato")

    const isMatch = await customer.comparePassword(password)
    if (!isMatch) throw createHttpError(401, "Password errata")

    const token = await createAccessToken({
      _id: customer._id,
      role: "Customer",
      name: customer.name,
      email: customer.email,
      avatar: customer.avatar
    })

    res.json({
      message: "Login customer riuscito",
      token
    })
  } catch (error) {
    next(error)
  }
}
