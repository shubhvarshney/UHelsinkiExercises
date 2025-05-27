import { useState, useEffect } from 'react'
import countryData from './services/countryData'
import weatherData from './services/weatherData'
import Display from './components/Display'

const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')
  const [show, setShow] = useState(null)
  const [weather, setWeather] = useState(null)
  
  useEffect(() => {
    countryData.getAll().then(allCountries => setCountries(allCountries))
    if (show) {
      weatherData.getWeather(show.capital[0]).then(weather => { setWeather(weather) })
    }
  }, [show])

  const handleSearch = (event) => {
    setSearch(event.target.value)
    setShow(null)
  }

  const handleShow = (name) => {
    countryData.getCountryByName(name).then(country => { setShow(country) })
  }

  return (
    <div>
      <div>
        find countries <input value={search} onChange={handleSearch}></input>
      </div>
      <Display countries={countries} search={search} handleShow={handleShow} show={show} weather={weather} />
    </div>
  )
}

export default App
