import React, { useState, useEffect } from "react";
import axios from "axios";
import { GB, CZ } from "country-flag-icons/react/3x2";

function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState("");
  const [language, setLanguage] = useState("en");
  const [isLoading, setIsLoading] = useState(true);

  const apiKey = import.meta.env.VITE_API_KEY;

  const weatherTranslations = {
    "clear sky": "jasno",
    "few clouds": "málo oblaků",
    "scattered clouds": "rozptýlené oblaky",
    "broken clouds": "oblačno",
    "overcast clouds": "zataženo",
    "shower rain": "přeháňky",
    "rain": "déšť",
    "thunderstorm": "bouřka",
    "snow": "sníh",
    "mist": "mlha",
    "light rain": "slabí déšť",
    "moderate rain": "mírný déšť",
    "heavy intensity rain": "silný déšť",
    "very heavy rain": "velmi silný déšť",
    "fog": "hustá mlha",
    "light rain and snow": "slabý déšť se sněhem",
    "rain and snow": "déšť se sněhem",
    "light shower snow": "slabé sněhové přeháňky",
    "shower snow": "sněhové přeháňky",
    "heavy shower snow": "silné sněhové přeháňky",
    "light intensity drizzle": "slabé mrholení",
    "drizzle": "mrholení",
    "heavy intensity drizzle": "silné mrholení",
    "drizzle rain": "mrholící déšť",
    "heavy intensity drizzle rain": "silný mrholící déšť",
    "shower rain and drizzle": "přeháňky s mrholením",
    "heavy shower rain and drizzle": "silné přeháňky s mrholením",
    "shower drizzle": "přeháňky mrholení",
  };

  let translatedDescription = data.weather ? data.weather[0].description : null;

  if (data.weather && language === "cz") {
    if (weatherTranslations[data.weather[0].description]) {
      translatedDescription = weatherTranslations[data.weather[0].description];
    }
  }

  const cityTranslation = {
    prague: "Praha",
  };

  let translateCity = data.name ? data.name : null;

  if (data.name && language === "cz") {
    if (cityTranslation[data.name.toLowerCase()]) {
      translateCity = cityTranslation[data.name.toLowerCase()];
    }
  }

  const fetchCityCoordinates = (lat, lon) => {
    setIsLoading(true);  // Začínáme načítání
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=${language}`;
    axios
      .get(url)
      .then((response) => {
        setData(response.data);
        setIsLoading(false);  // Když je načítání hotové, skrytí animace
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIsLoading(false); // Když dojde k chybě, animace se skryje
      });
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchCityCoordinates(latitude, longitude);
      },
      (error) => {
        console.error("Geolocation error:", error);
      }
    );
  }, [language]);

  const searchLocation = (event) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric&lang=${language}`;
    if (event.key === "Enter") {
      setIsLoading(true); // Začínáme načítání
      axios
        .get(url)
        .then((response) => {
          setData(response.data);
          setIsLoading(false); // Když je načítání hotové, skrytí animace
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setIsLoading(false); // Když dojde k chybě, animace se skryje
        });
      setLocation("");
    }
  };

  return (
    <>
      <div className="app">
        <button
          className="switchButton"
          onClick={() => setLanguage(language === "en" ? "cz" : "en")}
        >
          {language === "en" ? (
            <CZ title="Czech Republic" className="flag-icon" />
          ) : (
            <GB title="United Kingdom" className="flag-icon" />
          )}
          <span style={{ marginLeft: "8px" }}>
            {language === "en" ? "CZ" : "EN"}
          </span>
        </button>

        <div className="search">
          <input
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            onKeyDown={searchLocation}
            placeholder={language === "en" ? "Enter Location" : "Zadejte město"}
            type="text"
          />
        </div>
        {isLoading && (
            <div className="loading-animation">
              <div className="loading-cyrcles">
                <span className="cyrcle"></span>
                <span className="cyrcle"></span>
                <span className="cyrcle"></span>
                <span className="cyrcle"></span>
                <span className="cyrcle"></span>
              </div>
            </div>
        )}
        <div className="container">
          <div className="top">
            <div className="location">
              <p>{translateCity}</p>
              {/* <p>{data.name}</p> */}
            </div>
            <div className="temperature">
              {data.main ? <h1>{data.main.temp}&deg;C</h1> : null}
            </div>
            <div className="description">
              {/* {data.weather ? <p>{data.weather[0].main}</p> : null} */}
              {data.weather ? <p>{translatedDescription}</p> : null}
              {data.weather ? (
                <img
                  src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
                  alt="weather_icon"
                />
              ) : null}
            </div>
          </div>

          {data.name != undefined && (
            <div className="bottom">
              <div className="feels">
                {data.main ? (
                  <p className="bold">{data.main.feels_like}&deg;C</p>
                ) : null}
                <p>{language === "en" ? "Feels Like" : "Pocitová teplota"}</p>
              </div>
              <div className="humidity">
                {data.main ? (
                  <p className="bold">{data.main.humidity}%</p>
                ) : null}
                <p>{language === "en" ? "Humidity" : "Vlhkost vzduchu"}</p>
              </div>
              <div className="wind">
                {data.wind ? (
                  <p className="bold">{data.wind.speed}m/s</p>
                ) : null}
                <p>{language === "en" ? "Wind Speen" : "Rychlost větru"}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;




