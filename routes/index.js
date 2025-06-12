import express from "express"
const router = express.Router()

// ==============================
// Autenticazione
// ==============================

import authRouter from "./auth/index.js"
import googleOAuthRouter from "./auth/googleOAuth.route.js" // CORRETTO

router.use("/auth", authRouter)            // Login, registrazione, JWT
router.use("/auth", googleOAuthRouter)     // Login con Google OAuth2

// ==============================
// Profili e accesso utente
// ==============================

import adminRouter from "./admin.route.js"
import artistRouter from "./artist.route.js"
import customerRouter from "./customer.route.js"

router.use("/admin", adminRouter)         // Dashboard e profilo admin
router.use("/artist", artistRouter)       // Dashboard, profilo e ricerca artisti
router.use("/customer", customerRouter)   // Dashboard e profilo customer (viewer)

// ==============================
// Contenuti artistici
// ==============================

import showPublicRoutes from "./show.public.route.js"
import showPrivateRoutes from "./show.private.route.js"
import packagePublicRoutes from "./package.public.route.js"
import packagePrivateRoutes from "./package.private.route.js"
import projectRouter from "./project.route.js"
import categoryRouter from "./category.route.js" 

router.use("/shows", showPublicRoutes)    // GET pubblici
router.use("/shows", showPrivateRoutes)   // CRUD privati per artisti

// Rotte per categorie (per SearchBar e filtri)
router.use("/categories", categoryRouter)
    

router.use("/packages", packagePublicRoutes)
router.use("/packages", packagePrivateRoutes)

router.use("/projects", projectRouter)    // Gestione progetti artistici (solo artisti)

// ==============================
// Interazioni e comunicazione
// ==============================

import requestRouter from "./request.route.js"
import reviewRouter from "./review.route.js"
import likeRouter from "./like.route.js"
import calendarRouter from "./calendar.route.js"
import statsRouter from "./stats.route.js"

router.use("/requests", requestRouter)    // Invio e gestione richieste preventivo
router.use("/calendar", calendarRouter)   // Disponibilità e prenotazioni
router.use("/reviews", reviewRouter)      // Recensioni post-evento
router.use("/likes", likeRouter)          // Like a show/pacchetto/artista
router.use("/stats", statsRouter)         // Statistiche per admin/artisti

export default router


// ==============================