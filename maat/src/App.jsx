import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
//import './App.css'
import axios from 'axios'

function App() {
  const apiKey = import.meta.env.VITE_API_KEY

  const [currentInput, setCurrentInput] = useState('')
  const [allCountries, setAllCountries] = useState([])
  const [countriesThatMatchInput, setCountriesThatMatchInput] = useState([])
  const [weather, setWeather] = useState({})
  const [temp, setTemp] = useState(0)
  const [wind, setWind] = useState(0)

  const hook = () => {

    const promise = axios.get('https://studies.cs.helsinki.fi/restcountries/api/all')
    .then(function(response) {
      setAllCountries(response.data)
      
      if (countriesThatMatchInput.length === 1){
        console.log("calling weather api")

      const geocodePromise = axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${countriesThatMatchInput[0].capital}&appid=${apiKey}`)
      .then(function(response) {
        const lat = response.data[0].lat
        const lon = response.data[0].lon
        console.log("" + lat + "  " + lon)

        const weatherPromise = axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`)
        .then(function(response) {
          setWeather(response.data.weather[0])
          setTemp(response.data.main.temp - 273.15)
          setWind(response.data.wind.speed)

        })
      })
    }

    })
  }

  useEffect(hook, [countriesThatMatchInput])

  const handleInputChange = (event) =>
  {
    setCurrentInput(event.target.value)
    //console.log(currentInput)
    //console.log(allCountries)
    setCountriesThatMatchInput(allCountries.filter((country) => country.name.common.toLowerCase().includes(event.target.value.toLowerCase()) ))
  }

  const thingsToRender = function()
  {
      if(countriesThatMatchInput.length > 1 && countriesThatMatchInput.length < 11)
        return countriesThatMatchInput.map(country => 
        <div style={{display: "flex", flexDirection: "row"}}>
          <p>
            {country.name.common}
          </p>
          <button onClick={() => {setCurrentInput(country.name.common); setCountriesThatMatchInput(allCountries.filter((c) => c.name.common.toLowerCase().includes(country.name.common.toLowerCase()) ))}} style={{right: 0}}>show</button>
        </div>
        )

      else if(countriesThatMatchInput.length > 11)
        return <p>Too many countries that match your search</p>

      else if(countriesThatMatchInput.length == 1)
      {
        const langs = Object.values(countriesThatMatchInput[0].languages)

        console.log(temp)

        return <div >
                <h1>{countriesThatMatchInput[0].name.common}</h1>
                <p>Capital: {countriesThatMatchInput[0].capital[0]}</p>
                <p>Area: {countriesThatMatchInput[0].area}</p>
                <h2>Languages: </h2>
                <ul>
                {langs.map(((language) => <li>{language}</li>))}
                </ul>
                <img src={countriesThatMatchInput[0].flags.png}></img>
                <h1>Weather in {countriesThatMatchInput[0].capital}</h1>
                <p>temperature is {temp.toFixed(2)} Celsius</p>
                <img src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}></img>
                <p>wind is {wind.toFixed(2)} m/s</p>

                </div>
      }
  }

  return (
      <div style={{display: "flex", alignItems: "center", flexDirection: "column"}}>
        <p>Find Countries:</p>
        <input value={currentInput} onChange={handleInputChange}></input>
        {thingsToRender()} 
      </div>
  )
}

export default App
