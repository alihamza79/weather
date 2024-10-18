const API_KEY = '8d627f6c831604d7a4c70a9fde7f4123'; // Replace with your actual OpenWeatherMap API Key
const GEMINI_API_KEY = 'AIzaSyC9udCVZUD8HTSHUi8sEtmZy6shPz1xxYQ'; // Replace with your actual Gemini API Key

const weatherApiUrl = 'https://api.openweathermap.org/data/2.5/weather'; 
const geminiApiUrl = 'https://your-gemini-api-endpoint'; // Replace with actual Gemini endpoint

const chatWindow = document.getElementById('chatWindow');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');

// Add message to chat window
function addMessage(content, sender = 'bot') {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
    messageDiv.textContent = content;
    chatWindow.appendChild(messageDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight; // Scroll to the bottom
}

// Fetch weather data
async function fetchWeather(city) {
    const url = `${weatherApiUrl}?q=${city}&appid=${API_KEY}&units=metric`;
    console.log('Fetching weather for:', city); // Log city and URL

    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log('Weather API response:', data); // Log the response

        if (response.ok && data.cod === 200) {
            const weatherMessage = `The current weather in ${data.name} is ${data.weather[0].description} with a temperature of ${data.main.temp}°C.`;
            addMessage(weatherMessage, 'bot');
        } else {
            const errorMsg = data.message || 'City not found. Please try again.';
            addMessage(errorMsg, 'bot');
        }
    } catch (error) {
        addMessage('Error fetching weather data. Please try again later.', 'bot');
        console.error('Weather API error:', error); // Log error
    }
}

// Fetch Gemini API response for non-weather-related queries
async function fetchGeminiResponse(query) {
    console.log('Fetching Gemini response for query:', query);  // Log query

    const body = {
        prompt: query,
        temperature: 0.7,
        maxTokens: 150,
        apiKey: GEMINI_API_KEY
    };

    try {
        const response = await fetch(geminiApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });

        const result = await response.json();
        console.log('Gemini API response:', result);  // Log response

        if (response.ok && result.choices && result.choices.length > 0) {
            const reply = result.choices[0]?.text?.trim() || 'Sorry, no response found';
            addMessage(reply, 'bot');
        } else {
            addMessage('Sorry, I couldn’t get a valid response from Gemini. Please try again.', 'bot');
        }
    } catch (error) {
        addMessage('Sorry, I couldn’t understand that. Please try again.', 'bot');
        console.error('Gemini API error:', error); // Log error
    }
}

// Handle user input
async function handleUserInput() {
    const query = userInput.value.trim();
    if (!query) return;

    addMessage(query, 'user');
    userInput.value = ''; // Clear input

    // Check if user asked for weather
    if (query.toLowerCase().includes('weather')) {
        // Extract city from user query
        const city = query.replace(/.*weather\s*(in|for)?\s*/, '').trim();
        if (city) {
            await fetchWeather(city);
        } else {
            addMessage('Please specify a city to check the weather.', 'bot');
        }
    } else {
        // Handle non-weather-related queries using Gemini API
        await fetchGeminiResponse(query);
    }
}

// Event listener for the send button
sendButton.addEventListener('click', handleUserInput);

// Event listener for pressing "Enter"
userInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        handleUserInput();
    }
});
