import axios from "axios"

export const getCoordinatesFromAddress = async (city, address) => {
  const fullAddress = `${address}, ${city}`

  const response = await axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
    params: {
      address: fullAddress,
      key: process.env.GOOGLE_MAPS_API_KEY
    }
  })

  if (
    response.data.status === "OK" &&
    response.data.results &&
    response.data.results.length > 0
  ) {
    const { lat, lng } = response.data.results[0].geometry.location
    return { lat, lng }
  } else {
    throw new Error("Impossibile ottenere coordinate da Google Maps")
  }
}
