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

// Loader element
const loader = document.getElementById('loader');

// Show loader function
function showLoader() {
    loader.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent scrolling when loader is visible
}

// Hide loader function
function hideLoader() {
    loader.style.display = 'none';
    document.body.style.overflow = ''; // Restore scrolling
}

// Check if forecast data exists in localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
    showLoader();
    const savedForecastData = localStorage.getItem('forecastData');

    if (savedForecastData) {
        forecastData = JSON.parse(savedForecastData).list;
        originalForecastData = [...forecastData];
        updateTable();
    } else {
        hideLoader();
    }
});

// Event listener for the search button
searchBtn.addEventListener('click', () => {
    const cityName = cityInput.value.trim();
    if (cityName) {
        showLoader();
        getWeatherData(cityName);
    }
});

// Function to fetch weather data
async function getWeatherData(city) {
    try {
        const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`);
        const data = await forecastResponse.json();

        if (forecastResponse.ok) {
            forecastData = data.list;
            originalForecastData = [...forecastData];
            updateTable();
            localStorage.setItem('forecastData', JSON.stringify(data));
        } else {
            alert('City not found. Please try again.');
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Error fetching data. Please try again later.');
    } finally {
        hideLoader();
    }
}

// Function to update the table with forecast data
function updateTable() {
    showLoader();
    weatherTableBody.innerHTML = '';

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageData = forecastData.slice(start, end);

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
    hideLoader();
}

// Pagination controls
document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage > 1) {
        showLoader();
        currentPage--;
        updateTable();
    }
});

document.getElementById('next-page').addEventListener('click', () => {
    if (currentPage < Math.ceil(forecastData.length / itemsPerPage)) {
        showLoader();
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
    showLoader();
    resetForecastData();
    forecastData.sort((a, b) => a.main.temp - b.main.temp);
    updateTable();
});

// Sort descending
document.getElementById('sort-desc').addEventListener('click', () => {
    showLoader();
    resetForecastData();
    forecastData.sort((a, b) => b.main.temp - a.main.temp);
    updateTable();
});

// Filter rainy days
document.getElementById('filter-rain').addEventListener('click', () => {
    showLoader();
    resetForecastData();
    forecastData = forecastData.filter(entry => entry.weather[0].main.toLowerCase().includes('rain'));
    updateTable();
});

// Show highest temperature day
document.getElementById('highest-temp').addEventListener('click', () => {
    showLoader();
    resetForecastData();
    const highestTempDay = forecastData.reduce((highest, entry) => (entry.main.temp > highest.main.temp ? entry : highest), forecastData[0]);

    weatherTableBody.innerHTML = '';
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${new Date(highestTempDay.dt * 1000).toLocaleString()}</td>
        <td>${highestTempDay.main.temp} °C</td>
        <td>${highestTempDay.main.humidity} %</td>
        <td>${highestTempDay.wind.speed} m/s</td>
    `;
    weatherTableBody.appendChild(row);

    document.getElementById('page-info').textContent = 'Day with Highest Temperature';
    hideLoader();
});
