Weather App
This is a simple Weather App that provides real-time weather information for any location. The app uses the OpenWeather API to fetch the latest weather data.

Live Demo
You can try out the app here: https://weather-app79.vercel.app

Features
Get current weather details for any location.
Provides information such as temperature, humidity, wind speed, and more.
Simple, intuitive user interface.
Prerequisites
Before you begin, ensure you have met the following requirements:

You have Node.js installed.
You have npm installed.
You have access to an API key from OpenWeather.
Installation
Clone the repository:

bash
Copy code
git clone https://github.com/alihamza79/weather-app.git
Navigate to the project directory:

bash
Copy code
cd weather-app
Install the necessary dependencies:


Replace the API key in main.js:

Open the main.js file located in the src directory.
Find the line where the API key is declared, and replace the placeholder with your OpenWeather API key:
javascript
Copy code
const apiKey = 'your-api-key-here';
Running the App
To run the app locally, use the following command:


You can  run the project using a live server:

If you have a live server extension (such as in VSCode), right-click on the index.html file and choose "Open with Live Server."
Technologies Used
HTML/CSS
JavaScript (ES6)
OpenWeather API
Vercel for deployment
Deployment
The app is deployed using Vercel. You can deploy the app by connecting your GitHub repository to Vercel, and it will automatically deploy on every push to the main branch.

