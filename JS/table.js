// Your OpenWeather API key
const apiKey = 'cd9d4a7836d541deba04f3bf9536640b';

// Select elements
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const weatherTableBody = document.querySelector('#weather-table tbody');
let forecastData = [];
let originalForecastData = [];
let currentPage = 1;
const itemsPerPage = 5;

// Check if forecast data exists in localStorage on page load
window.addEventListener('DOMContentLoaded', () => {
    const savedForecastData = localStorage.getItem('forecastData');

    if (savedForecastData) {
        forecastData = JSON.parse(savedForecastData).list; // Get list from forecast data
        originalForecastData = [...forecastData]; // Make a copy of the original data
        updateTable();
    }
});

// Event listener for the search button
searchBtn.addEventListener('click', () => {
    const cityName = cityInput.value.trim();
    if (cityName) {
        getWeatherData(cityName);
    }
});

// Function to fetch weather data
async function getWeatherData(city) {
    try {
        // Fetch 5-day weather forecast
        const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`);
        const data = await forecastResponse.json();

        if (forecastResponse.ok) {
            forecastData = data.list; // Store the forecast data
            originalForecastData = [...forecastData]; // Make a copy of the original data
            updateTable();

            // Store forecast data in localStorage
            localStorage.setItem('forecastData', JSON.stringify(data));
        } else {
            alert('City not found. Please try again.');
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Error fetching data. Please try again later.');
    }
}

// Function to update the table with forecast data
function updateTable() {
    weatherTableBody.innerHTML = ''; // Clear existing data

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageData = forecastData.slice(start, end);

    // Populate the table with the data
    pageData.forEach(entry => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${new Date(entry.dt * 1000).toLocaleString()}</td>
            <td>${entry.main.temp} °C</td>
            <td>${entry.main.humidity} %</td>
            <td>${entry.wind.speed} m/s</td>
        `;
        weatherTableBody.appendChild(row);
    });

    document.getElementById('page-info').textContent = `Page ${currentPage}`;
}

// Pagination controls
document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        updateTable();
    }
});

document.getElementById('next-page').addEventListener('click', () => {
    if (currentPage < Math.ceil(forecastData.length / itemsPerPage)) {
        currentPage++;
        updateTable();
    }
});

// Reset forecast data
function resetForecastData() {
    forecastData = [...originalForecastData];
    currentPage = 1;
}

// Sort ascending
document.getElementById('sort-asc').addEventListener('click', () => {
    resetForecastData();
    forecastData.sort((a, b) => a.main.temp - b.main.temp);
    updateTable();
});

// Sort descending
document.getElementById('sort-desc').addEventListener('click', () => {
    resetForecastData();
    forecastData.sort((a, b) => b.main.temp - a.main.temp);
    updateTable();
});

// Filter rainy days
document.getElementById('filter-rain').addEventListener('click', () => {
    resetForecastData();
    forecastData = forecastData.filter(entry => entry.weather[0].main.toLowerCase().includes('rain'));
    updateTable();
});

// Show highest temperature day
document.getElementById('highest-temp').addEventListener('click', () => {
    resetForecastData();
    const highestTempDay = forecastData.reduce((highest, entry) => (entry.main.temp > highest.main.temp ? entry : highest), forecastData[0]);

    weatherTableBody.innerHTML = ''; // Clear existing data
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${new Date(highestTempDay.dt * 1000).toLocaleString()}</td>
        <td>${highestTempDay.main.temp} °C</td>
        <td>${highestTempDay.main.humidity} %</td>
        <td>${highestTempDay.wind.speed} m/s</td>
    `;
    weatherTableBody.appendChild(row);

    document.getElementById('page-info').textContent = 'Day with Highest Temperature';
});
