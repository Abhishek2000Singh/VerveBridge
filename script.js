document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('weather-form');
    const cityInput = document.getElementById('city-input');
    const suggestionsContainer = document.getElementById('suggestions');
    const weatherContainer = document.getElementById('weather-container');
    const errorMessage = document.getElementById('error-message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const city = cityInput.value.trim();
        if (city) {
            try {
                const apiKey = '115cef767a19b5b089698320a0b52d9f'; // Replace with your OpenWeatherMap API key
                const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
                if (!response.ok) {
                    throw new Error('City not found');
                }
                const data = await response.json();
                displayWeather(data);
                errorMessage.textContent = '';
            } catch (error) {
                errorMessage.textContent = 'Failed to fetch weather data. Please try again.';
                weatherContainer.classList.remove('visible');
            }
        }
    });

    cityInput.addEventListener('input', async () => {
        const query = cityInput.value.trim();
        if (query.length > 2) {
            try {
                const response = await fetch(`http://api.geonames.org/searchJSON?name_startsWith=${query}&maxRows=10&username=AbhishekSingh3000`);
                const data = await response.json();
                displaySuggestions(data.geonames);
            } catch (error) {
                console.error('Error fetching suggestions', error);
            }
        } else {
            suggestionsContainer.innerHTML = '';
            suggestionsContainer.style.display = 'none';
        }
    });

    const displaySuggestions = (cities) => {
        suggestionsContainer.innerHTML = '';
        if (cities.length > 0) {
            cities.forEach((city) => {
                const suggestionItem = document.createElement('div');
                suggestionItem.classList.add('suggestion-item');
                suggestionItem.textContent = `${city.name}, ${city.countryName}`;
                suggestionItem.addEventListener('click', () => {
                    cityInput.value = city.name;
                    suggestionsContainer.innerHTML = '';
                    suggestionsContainer.style.display = 'none';
                });
                suggestionsContainer.appendChild(suggestionItem);
            });
            suggestionsContainer.style.display = 'block';
        } else {
            suggestionsContainer.style.display = 'none';
        }
    };

    const displayWeather = (data) => {
        const { name, sys, main, weather, wind } = data;
        weatherContainer.innerHTML = `
        <h2>${name}, ${sys.country}</h2>
        <div class="weather-details">
          <div class="temperature">
            ${Math.round(main.temp)}°C
            <p>${weather[0].description}</p>
          </div>
          <div class="extra-details">
            <p>Humidity: ${main.humidity}%</p>
            <p>Wind: ${wind.speed} m/s</p>
          </div>
        </div>
      `;
        weatherContainer.classList.add('visible');
    };
});
