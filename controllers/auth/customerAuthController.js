import Customer from "../../models/Customer.js"
import createHttpError from "http-errors"
import { createAccessToken } from "../../tools/jwtTools.js"

// REGISTRAZIONE
export const registerCustomer = async (req, res, next) => {
  try {
    const { email, password, name } = req.body

    const existing = await Customer.findOne({ email })
    if (existing) throw createHttpError(409, "Email già registrata")

    const newCustomer = new Customer({ email, password, name })
    await newCustomer.save()

    const token = await createAccessToken({
      _id: newCustomer._id,
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
    if (!customer) throw createHttpError(401, "Credenziali non valide")

    const isMatch = await customer.isPasswordCorrect(password)
    if (!isMatch) throw createHttpError(401, "Credenziali non valide")

    const token = await createAccessToken({
      _id: customer._id,
      model: "Customer"
    })

    res.json({
      message: "Login customer riuscito",
      token
    })
  } catch (error) {
    next(error)
  }
}
