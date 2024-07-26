const API_KEY = "2bfae4faa823ec602adbc41873ea26ca";


const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const weatherCardsDiv = document.querySelector(".weather-cards");
const currentWeather = document.querySelector(".current-weather");
const cityInput = document.querySelector(".city-input");



const createWeatherCard = (cityName, weatherItem, index) =>{
    if(index === 0){
        return `<div class="details">
                    <h2>${cityName} ( ${weatherItem.dt_txt.split(" ")[0]} )</h2>
                    <h4>Temp: ${Math.round(weatherItem.main.temp - 273.15)}°C</h4>
                    <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
                    <h4>Humidity: ${weatherItem.main.humidity}%</h4>
                </div>
                <div class="icon">
                    <img
                    src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png"
                    alt="Weather-icon"
                    srcset=""
                    />
                    <h4>${weatherItem.weather[0].description}</h4>
                </div>`;
    }else{
        return `<li class="card">
        <h3>${weatherItem.dt_txt.split(" ")[0]}</h3>
        <img
        src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png"
        alt="Weather-icon"
        srcset=""
        />
        <h4>${weatherItem.weather[0].description}</h4>
        <h4>Temp: ${Math.round(weatherItem.main.temp - 273.15)}°C</h4>
        <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
        <h4>Humidity: ${weatherItem.main.humidity}%</h4>
        </li>`; 
    }
}



const getWeatherDetails = (cityName, lat, lon) => {
    
    const WEATHER_API_URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
            const uniqueForecastDays = [];

            const fiveDaysForecast = data.list.filter(forecast => {
                const forecastDate = new Date(forecast.dt_txt).getDate();

            if(!uniqueForecastDays.includes(forecastDate)){
                return uniqueForecastDays.push(forecastDate);
            }
            });
            console.log(data);

            // Clearing previous weather data
            cityInput.value = "";
            weatherCardsDiv.innerHTML = "";
            currentWeather.innerHTML = "";

            // console.log(fiveDaysForecast);
            fiveDaysForecast.forEach((weatherItem, index) => {
                if(index === 0){
                    currentWeather.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
                }else{
                    weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
                }
            });
    }).catch(() => {
        alert("An error is ocurred while fetching the weather forecast!");
    });
}

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if(!cityName) return;

    console.log(cityName);

    const GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${API_KEY}`;


    // get entered city coordinates (latitude, longitude and name) from the API response
    fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
        if(!data.length) return alert(`No coordinates found for ${cityName}`);
        const {name, lat, lon} = data[0];
        getWeatherDetails(name, lat, lon);
        console.log(data);
    }).catch(() => {
        alert("An error is ocurred while fetching the coordinates!");
        // document.querySelector(".error").style.display = "block";
        // document.querySelector(".weather-data").style.display = "none";
    });
}

searchButton.addEventListener("click", getCityCoordinates);


const getUserCoordinates = () =>{
    navigator.geolocation.getCurrentPosition(
        position => {
            const{latitude, longitude} = position.coords;
            const REVERSE_GEOCODING_URL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
            fetch(REVERSE_GEOCODING_URL).then(res => res.json()).then(data => {
                const {name} = data[0];
                getWeatherDetails(name, latitude, longitude);
            }).catch(() => {
                alert("An error is ocurred while fetching your city!");
                // document.querySelector(".error").style.display = "block";
                // document.querySelector(".weather-data").style.display = "none";
            });
            // console.log(position);
        },
        error => {
            if (error.code === error.PERMISSION_DENIED){
                alert("Location Access Denied. Please reset your location permission.");
            }
            // console.log(error);
        }
    );
}

locationButton.addEventListener("click", getUserCoordinates);