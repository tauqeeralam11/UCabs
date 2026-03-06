import axios from 'axios';
export const getCoordinates = async (address) => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
    );

    if (response.data && response.data.length > 0) {
      return [parseFloat(response.data[0].lon), parseFloat(response.data[0].lat)];
    }
    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
};