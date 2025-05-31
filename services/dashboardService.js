// services/dashboardService.js

// Restituisce un messaggio di benvenuto personalizzato per l'utente loggato,
// includendo nome, ruolo e ID.
// Viene utilizzata nei dashboard dei tre ruoli principali: Artist, Customer, Admin.
export const getDashboardMessage = (req, res) => {
  const name = req.user.name || "utente" // Fallback se il nome non è presente
  const role = req.userType             // Definito dinamicamente dal middleware JWT
  const id = req.user._id               // ID univoco dell'utente

  res.json({
    message: `Benvenuto ${name} (${role})! Il tuo ID è ${id}`,
    role,
    name,
    id
  })
}
