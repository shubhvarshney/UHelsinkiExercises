import axios from 'axios'

const baseURL = "https://studies.cs.helsinki.fi/restcountries/api"

const getAll = () => {
    const url = `${baseURL}/all`
    const request = axios.get(url)
    return request.then(response => response.data)
}

const getCountryByName = (name) => {
    const url = `${baseURL}/name/${name}`
    const request = axios.get(url)
    return request.then(response => response.data)
}

export default {getAll, getCountryByName}