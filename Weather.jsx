import React, { useEffect, useState, useRef } from "react";
import "./Weather.css";
import search_icon from "../assets/search.png";

import clear_icon from "../assets/clear.png";
import cloud_icon from "../assets/cloud.png";
import drizzle_icon from "../assets/drizzle.png";
import rain_icon from "../assets/rain.png";
import snow_icon from "../assets/snow.png";
import humidity_icon from "../assets/humidity.png";
import wind_icon from "../assets/wind.png";

const Weather = () => {
    const API_KEY = "877bb5daed980adf8c9b973569478745";
    const inputRef = useRef();
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const allIcons = {
        "01d": clear_icon,
        "01n": clear_icon,
        "02d": cloud_icon,
        "02n": cloud_icon,
        "03d": cloud_icon,
        "03n": cloud_icon,
        "04d": drizzle_icon,
        "04n": drizzle_icon,
        "09d": rain_icon,
        "09n": rain_icon,
        "10d": rain_icon,
        "10n": rain_icon,
        "13d": snow_icon,
        "13n": snow_icon,
    };

    const search = async (city) => {
        if (!city) {
            alert("Enter City Name");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
            const response = await fetch(url);
            const data = await response.json();

            if (!response.ok) {
                setError(data.message);
                return;
            }

            const icon = allIcons[data.weather[0].icon] || clear_icon;
            setWeatherData({
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                temperature: Math.floor(data.main.temp),
                location: data.name,
                icon: icon,
            });
        } catch (error) {
            setError("Unable to fetch data. Try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        search("London");
    }, []);

    return (
        <div className="weather">
            <div className="search-bar">
                <input ref={inputRef} type="text" placeholder="Search city" />
                <img src={search_icon} alt="Search" onClick={() => search(inputRef.current.value)} />
            </div>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="error-message">{error}</p>
            ) : weatherData ? (
                <>
                    <img src={weatherData.icon} alt="" className="weather-icon" />
                    <p className="temperature">{weatherData.temperature}°C</p>
                    <p className="location">{weatherData.location}</p>
                    <div className="weather-data">
                        <div className="col">
                            <img src={humidity_icon} alt="" />
                            <div>
                                <p>{weatherData.humidity}%</p>
                                <span>Humidity</span>
                            </div>
                        </div>
                        <div className="col">
                            <img src={wind_icon} alt="" />
                            <div>
                                <p>{weatherData.windSpeed} m/s</p>
                                <span>Wind Speed</span>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <p>Enter a city to get started.</p>
            )}
        </div>
    );
};

export default Weather;
