// Your OpenWeather API key
const apiKey = 'cd9d4a7836d541deba04f3bf9536640b';

// Select elements
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const cityNameEl = document.getElementById('city-name');
const weatherDescriptionEl = document.getElementById('weather-description');
const temperatureEl = document.getElementById('temperature');
const humidityEl = document.getElementById('humidity');
const windSpeedEl = document.getElementById('wind-speed');
const weatherIconEl = document.getElementById('weather-icon'); // Reference to the weather icon image
const dashboardBtn = document.getElementById('dashboard-btn');
const tablesBtn = document.getElementById('tables-btn');

// Global variable to hold weather data
let currentWeatherData = null;
let forecastData = {};

// Check for saved weather data in localStorage
window.addEventListener('DOMContentLoaded', () => {
    const savedWeatherData = localStorage.getItem('currentWeatherData');
    const savedForecastData = localStorage.getItem('forecastData');

    if (savedWeatherData && savedForecastData) {
        currentWeatherData = JSON.parse(savedWeatherData);
        forecastData = JSON.parse(savedForecastData);
        updateWeatherDetails(currentWeatherData);  // Update the UI with saved data
        updateCharts(forecastData);
    }
});

// Event listener for the search button
searchBtn.addEventListener('click', () => {
    const cityName = cityInput.value.trim(); // Trim to avoid extra spaces
    if (cityName) {
        getWeatherData(cityName);
    }
});

// Function to fetch current weather and 5-day forecast
async function getWeatherData(city) {
    try {
        // API call for current weather
        const currentWeatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
        currentWeatherData = await currentWeatherResponse.json();

        if (currentWeatherResponse.ok) {
            updateWeatherDetails(currentWeatherData);
            
            // Store the current weather data in localStorage
            localStorage.setItem('currentWeatherData', JSON.stringify(currentWeatherData));

            // Fetch 5-day weather forecast
            const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`);
            forecastData = await forecastResponse.json();

            if (forecastResponse.ok) {
                updateCharts(forecastData);
                
                // Store the forecast data in localStorage
                localStorage.setItem('forecastData', JSON.stringify(forecastData));
            }
        } else {
            alert('City not found. Please try again.');
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Error fetching data. Please try again later.');
    }
}

// Function to update the weather details on the page
function updateWeatherDetails(data) {
    const { name, main, wind, weather } = data;
    cityNameEl.textContent = name;
    weatherDescriptionEl.textContent = weather[0].description;
    temperatureEl.textContent = main.temp;
    humidityEl.textContent = main.humidity;
    windSpeedEl.textContent = wind.speed;

    // Update the weather icon
    const iconCode = weather[0].icon; // Get the icon code
    weatherIconEl.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`; // Set the icon URL

    const weatherCondition = weather[0].main.toLowerCase();
    const weatherDataContainer = document.querySelector('.weather-data');
    switch (weatherCondition) {
        case 'clear':
            weatherDataContainer.style.backgroundColor = '#f7d154';
            break;
        case 'clouds':
            weatherDataContainer.style.backgroundColor = '#b3b3b3';
            break;
        case 'rain':
            weatherDataContainer.style.backgroundColor = '#74b9ff';
            break;
        case 'snow':
            weatherDataContainer.style.backgroundColor = '#dfe6e9';
            break;
        default:
            weatherDataContainer.style.backgroundColor = '#f5f5f5';
            break;
    }
}

// Event listener to show the dashboard
dashboardBtn.addEventListener('click', () => {
    document.querySelector('.weather-data').style.display = 'block'; // Show dashboard
});

// Event listener to show the tables
tablesBtn.addEventListener('click', () => {
    document.querySelector('.weather-data').style.display = 'none'; // Hide dashboard
    if (currentWeatherData) {
        populateTable(currentWeatherData);
    }
});

// Function to populate the table
function populateTable(data) {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = ''; // Clear existing table data

    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${data.name}</td>
        <td>${data.main.temp} °C</td>
        <td>${data.main.humidity} %</td>
        <td>${data.wind.speed} m/s</td>
        <td>${data.weather[0].description}</td>
    `;
    tableBody.appendChild(row);
}

// Function to update charts (you can implement this function)
function updateCharts(data) {
    // Implement your chart update logic here
}
