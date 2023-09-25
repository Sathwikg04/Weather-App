const API_KEY = '6693b0a00d754a837561e6d6fe1889aa';

async function fetchWeather() {
    const city = document.getElementById('cityInput').value;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        displayCurrentWeather(data);
        fetchForecast(city);
    } catch (error) {
        console.log('Error fetching weather data: ', error);
    }
}

async function fetchForecast(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        displayForecast(data);
    } catch (error) {
        console.log('Error fetching forecast data: ', error);
    }
}

function displayCurrentWeather(data) {
    const currentWeatherDiv = document.getElementById('currentWeather');
    currentWeatherDiv.innerHTML = `
        <h2>Current Weather in ${data.name}</h2>
        <p>Weather Condition: ${data.weather[0].description}</p>
        <p>Temperature: ${data.main.temp} °C</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
    `;
}


function displayForecast(data) {
    const forecastData = data.list;
    const forecastContainer = document.getElementById('forecastContainer');
    forecastContainer.innerHTML = '';

    const forecastAt9AM = forecastData.filter(forecast => {
        const date = new Date(forecast.dt_txt);
        return date.getHours() === 9;
    });

    for (const forecast of forecastAt9AM) {
        const date = new Date(forecast.dt_txt).toDateString();
        const time = new Date(forecast.dt_txt).toLocaleTimeString();

        forecastContainer.innerHTML += `
            <div class="forecast-card">
                <h3>${date}</h3>
                <p>Time: ${time}</p>
                <p>Weather Condition: ${forecast.weather[0].description}</p>
                <p>Temperature: ${forecast.main.temp} °C</p>
                <p>Humidity: ${forecast.main.humidity}%</p>
                <p>Wind Speed: ${forecast.wind.speed} m/s</p>
            </div>
        `;
    }
}


document.addEventListener('DOMContentLoaded', () => {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                fetchWeatherByCoords(latitude, longitude);
            },
            () => {
                fetchWeatherByDefaultLocation();
            }
        );
    } else {
        fetchWeatherByDefaultLocation();
    }
});

async function fetchWeatherByCoords(latitude, longitude) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        displayCurrentWeather(data);
        fetchForecast(data.name);
    } catch (error) {
        console.log('Error fetching weather data: ', error);
    }
}

function fetchWeatherByDefaultLocation() {
    fetchWeather('Delhi');
}
