let barChart, doughnutChart, lineChart;
let isChartInitialized = false;  // To track if charts are already initialized

// Function to initialize charts (only done once)
function initCharts() {
    const ctxBar = document.getElementById('barChart').getContext('2d');
    const ctxDoughnut = document.getElementById('doughnutChart').getContext('2d');
    const ctxLine = document.getElementById('lineChart').getContext('2d');

    // Bar Chart
    barChart = new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Temperature (°C)',
                data: [],
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            animation: {
                duration: 2000
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Doughnut Chart (Colors will be updated based on temperature)
    doughnutChart = new Chart(ctxDoughnut, {
        type: 'doughnut',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [] // This will be dynamically updated
            }]
        },
        options: {
            animation: {
                duration: 2500,
                easing: 'easeInOutBounce'
            }
        }
    });

    // Line Chart
    lineChart = new Chart(ctxLine, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Temperature (°C)',
                data: [],
                fill: false,
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.1
            }]
        },
        options: {
            animation: {
                duration: 3000,
                easing: 'easeOutBounce'
            }
        }
    });

    isChartInitialized = true;  // Mark charts as initialized
}

// Function to determine color based on temperature
function getTemperatureColor(temp) {
    if (temp <= 10) {
        return '#3498db';  // Blue for cold temperatures
    } else if (temp <= 25) {
        return '#f1c40f';  // Yellow for moderate temperatures
    } else {
        return '#e74c3c';  // Red for warm temperatures
    }
}

// Function to update charts with forecast data
function updateCharts(data) {
    const forecastList = data.list;

    // Ensure charts are initialized
    if (!isChartInitialized) {
        initCharts();
    }

    // Arrays to hold data for charts
    let temperatures = [];
    let dates = [];
    let doughnutColors = []; // To hold the dynamic colors for doughnut chart

    // Extracting temperature and weather data for 5 days (every 8th data point is 24 hours apart)
    for (let i = 0; i < forecastList.length; i += 8) {
        const forecast = forecastList[i];
        const temp = forecast.main.temp;

        temperatures.push(temp);
        dates.push(new Date(forecast.dt_txt).toLocaleDateString());

        // Assign color based on temperature
        doughnutColors.push(getTemperatureColor(temp));
    }

    // Clear old data and update with new data for Bar Chart
    barChart.data.labels = dates;
    barChart.data.datasets[0].data = temperatures;
    barChart.update();  // Call update to render the chart with new data

    // Clear old data and update with new data for Doughnut Chart
    doughnutChart.data.labels = dates;
    doughnutChart.data.datasets[0].data = temperatures;
    doughnutChart.data.datasets[0].backgroundColor = doughnutColors; // Assign the dynamic colors
    doughnutChart.update();  // Call update to render the chart with new data

    // Clear old data and update with new data for Line Chart
    lineChart.data.labels = dates;
    lineChart.data.datasets[0].data = temperatures;
    lineChart.update();  // Call update to render the chart with new data
}

// Function to reset chart data (clears the data but keeps the chart intact)
function resetChartData() {
    if (isChartInitialized) {
        // Clear data for Bar Chart
        barChart.data.labels = [];
        barChart.data.datasets[0].data = [];

        // Clear data for Doughnut Chart
        doughnutChart.data.labels = [];
        doughnutChart.data.datasets[0].data = [];
        doughnutChart.data.datasets[0].backgroundColor = [];

        // Clear data for Line Chart
        lineChart.data.labels = [];
        lineChart.data.datasets[0].data = [];
    }
}

// Initialize charts when the page loads
window.onload = function () {
    initCharts();  // Ensure charts are initialized on page load
};
