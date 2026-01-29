const API_KEY = '7f1e92c31e7945b597a132244241212';
const cityInput = document.querySelector('#city-input');
const searchBtn = document.querySelector('#search-btn');
const cityName = document.querySelector('#city-name');
const coordinates = document.querySelector('#coordinates');
const weatherCondition = document.querySelector('#weather-condition');
const temperature = document.querySelector('#temperature');
const feelsLike = document.querySelector('#feels-like');
const humidity = document.querySelector('#humidity');
const windSpeed = document.querySelector('#wind-speed');
const minMax = document.querySelector('#min-max');
const mapsLink = document.querySelector('#maps-link');

const fetchWeather = async (city) => {
    try {
        const url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            alert('City not found. Please try another city.');
            return;
        }

        cityName.textContent = data.location.name;
        coordinates.textContent = `Lat: ${data.location.lat} | Lon: ${data.location.lon}`;
        weatherCondition.textContent = data.current.condition.text;
        temperature.textContent = `${data.current.temp_c}°C`;
        feelsLike.textContent = `Feels like ${data.current.feelslike_c}°C`;
        humidity.textContent = `${data.current.humidity}%`;
        windSpeed.textContent = `${data.current.wind_kph} kph`;
        minMax.textContent = `${data.current.temp_c - 2}°C / ${data.current.temp_c + 2}°C`;

        const mapsUrl = `https://www.google.com/maps/@${data.location.lat},${data.location.lon},13z`;
        mapsLink.href = mapsUrl;
    } catch (error) {
        alert('Error fetching weather data. Please try again.');
    }
};

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeather(city);
    }
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) {
            fetchWeather(city);
        }
    }
});

fetchWeather('London');