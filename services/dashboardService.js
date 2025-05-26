export const getDashboardMessage = (req, res) => {
    const name = req.user.name || "utente"
    const role = req.user.role
    const id = req.user._id
  
    res.json({
      message: `Benvenuto ${name} (${role})! Il tuo ID è ${id}`,
      role,
      name,
      id
    })
  }