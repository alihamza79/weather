const apiKey = 'cfb5f8605cd9c4aef4d7f5dbc3cb8887';
const forecastTable = document.getElementById('forecastTable');
const forecastCityName = document.getElementById('forecastCityName'); // Get the element for city name
const loader = document.querySelector('.loader');
async function fetchWeatherForecast(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

    try {
        showLoader();
        const response = await fetch(url);
        const data = await response.json();
     

        // Clear existing table data
        forecastTable.innerHTML = '';

        // Check for a successful response
        if (response.ok) {
            hideLoader();
            // Set the city name in the heading
            forecastCityName.innerText = city.charAt(0).toUpperCase() + city.slice(1); // Capitalize city name

            // Get the next 5 days forecast
            const dailyForecasts = data.list.filter(item => {
                const date = new Date(item.dt * 1000).toLocaleDateString();
                return date !== new Date().toLocaleDateString() && item.dt_txt.includes('12:00:00');
            }).slice(0, 5);

            dailyForecasts.forEach(forecast => {
                const date = new Date(forecast.dt * 1000).toLocaleDateString();
                const temp = forecast.main.temp.toFixed(1);
                const weatherCondition = forecast.weather[0].description;

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="border-b p-2">${date}</td>
                    <td class="border-b p-2">${temp} °C</td>
                    <td class="border-b p-2">${weatherCondition.charAt(0).toUpperCase() + weatherCondition.slice(1)}</td>
                `;
                forecastTable.appendChild(row);
            });
        } else {
            alert(data.message);
        }
    } catch (error) {
        hideLoader();
        console.error('Error fetching weather data:', error);
    }
}
// Show loader function
function showLoader() {
    loader.style.display = 'flex';  // Display loader (flex to center it)
}

// Hide loader function
function hideLoader() {
    loader.style.display = 'none';  // Hide loader after content is loaded
}
fetchWeatherForecast("Islamabad")