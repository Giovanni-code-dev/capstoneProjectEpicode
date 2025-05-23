import express from "express"
import { register, login } from "../controllers/authController.js"

const router = express.Router()

// 🔐 Rotte reali
router.post("/register", register)
router.post("/login", login)

// 🌐 Rotta di test (puoi tenerla o rimuoverla)
router.get("/test", (req, res) => {
  res.send("Auth route OK 🎯")
})

export default router
