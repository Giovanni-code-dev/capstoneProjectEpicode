export const getDashboardMessage = (req, res) => {
  const name = req.user.name || "utente"
  const role = req.userType // Usa il tipo dinamico (Artist, Customer, Admin)
  const id = req.user._id

  res.json({
    message: `Benvenuto ${name} (${role})! Il tuo ID è ${id}`,
    role,
    name,
    id
  })
}
