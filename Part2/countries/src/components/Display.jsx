
const Weather = ({capital, weather}) => {
    if (weather) {
        return (
            <div>
                <h2>Weather in {capital}</h2>
                <div>
                    Temperature {weather.main.temp - 273.15} Celsius
                </div>
                <div>
                    <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={weather.weather[0].description} width="100px" />
                </div>
                <div>
                    Wind {weather.wind.speed} m/s
                </div>
            </div>
        )
    } else {
        return (<div> </div>)
    }
}

const View = ({country, weather}) => {
    return (
        <div>
            <h1>{country.name.common}</h1>
            <div>
                Capital {country.capital[0]}
            </div>
            <div>
                Area {country.area}
            </div>
            <h2>Languages</h2>
            <ul>
                {Object.keys(country.languages).map(langKey => 
                    <li key={langKey}>{country.languages[langKey]}</li>
                )}
            </ul>
            <div>
                <img src={country.flags.png} alt={country.flag} width="200px" />
            </div>
            <Weather capital={country.capital[0]} weather={weather} />
        </div>
    )
}
const Display = (props) => {
    const countriesToList = props.countries.filter(country => country.name.common.toLowerCase().includes(props.search.toLowerCase()))

    if (countriesToList.length > 10) {
        return (
            <div>
                Too many matches, specify another filter
            </div>
        )
    } else if (countriesToList.length > 1) {
        return (
            <div>
                <ul>
                    {countriesToList.map(country => {
                        return (
                            <li key={country.name.common}>{country.name.common} <button onClick={() => props.handleShow(country.name.common)}>Show</button> </li>
                        )
                    }
                    )}
                </ul>

                {props.show != null ? <View country={props.show} weather={props.weather} /> : <div></div>}
            </div>
        )
    } else if (countriesToList.length === 1) {
        
        if (props.show === null || props.show.name.common !== countriesToList[0].name.common) {
            props.handleShow(countriesToList[0].name.common)
        }

        return (
            <div>
                <View country={countriesToList[0]} weather={props.weather} />
            </div>
        )
    }
}

export default Display