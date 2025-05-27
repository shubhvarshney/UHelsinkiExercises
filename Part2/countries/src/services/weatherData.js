import axios from "axios"

const api_key = import.meta.env.VITE_SOME_KEY
const baseURL = "https://api.openweathermap.org/data/2.5/weather"

const getWeather = (capital) => {
    const url = `${baseURL}?q=${capital}&appid=${api_key}`
    const request = axios.get(url)
    return request.then(response => response.data)
}

export default { getWeather }