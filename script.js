// 🔥 ADD YOUR API KEY HERE
const API_KEY = "48739f1fdb4c7e00ff0d252850a86f9f";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const cityEl = document.getElementById("city");
const tempEl = document.getElementById("temp");
const descEl = document.getElementById("desc");

const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");
const feelsEl = document.getElementById("feels");
const minmaxEl = document.getElementById("minmax");

const hourlyEl = document.getElementById("hourly");
const forecastEl = document.getElementById("forecast");

const suggestionEl = document.getElementById("suggestion");
const themeToggle = document.getElementById("themeToggle");

/* 🌙 THEME */
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

themeToggle.onclick = () => {
  document.body.classList.toggle("dark");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );
};

/* 📍 GEOLOCATION */
navigator.geolocation.getCurrentPosition(
  (pos) => {
    getWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
  },
  () => {
    console.log("Location permission denied");
  }
);

/* 🔍 SEARCH */
searchBtn.onclick = () => {
  const city = cityInput.value.trim();
  if (!city) {
    alert("Enter city name");
    return;
  }
  getWeather(city);
};

/* 🌦 FETCH WEATHER BY CITY */
async function getWeather(city) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
    );

    const data = await res.json();

    // 🔥 FIX: proper error handling
    if (data.cod !== 200) {
      alert("City not found or API not active yet");
      return;
    }

    displayWeather(data);
    getForecast(data.coord.lat, data.coord.lon);

  } catch (err) {
    alert("Something went wrong");
    console.error(err);
  }
}

/* 📍 FETCH BY COORDS */
async function getWeatherByCoords(lat, lon) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );

    const data = await res.json();

    if (data.cod !== 200) return;

    displayWeather(data);
    getForecast(lat, lon);

  } catch (err) {
    console.error(err);
  }
}

/* 🖥 DISPLAY WEATHER */
function displayWeather(data) {
  if (!data || !data.main) return;

  cityEl.innerText = data.name || "--";
  tempEl.innerText = Math.round(data.main.temp) + "°";
  descEl.innerText = data.weather[0].main;

  humidityEl.innerText = data.main.humidity + "%";
  windEl.innerText = data.wind.speed + " m/s";
  feelsEl.innerText = Math.round(data.main.feels_like) + "°";
  minmaxEl.innerText = `${Math.round(data.main.temp_min)}° / ${Math.round(data.main.temp_max)}°`;

  setSuggestion(data.main.temp, data.weather[0].main);
}

/* 💡 SUGGESTIONS */
function setSuggestion(temp, weather) {
  if (weather.includes("Rain")) {
    suggestionEl.innerText = "🌧 Carry an umbrella";
  } else if (temp > 30) {
    suggestionEl.innerText = "🥵 Stay hydrated";
  } else {
    suggestionEl.innerText = "😊 Enjoy your day";
  }
}

/* 📊 FORECAST */
async function getForecast(lat, lon) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );

    const data = await res.json();

    displayHourly(data.list.slice(0, 8));
    displayForecast(data.list);

  } catch (err) {
    console.error(err);
  }
}

/* ⏳ HOURLY */
function displayHourly(list) {
  hourlyEl.innerHTML = "";

  list.forEach(item => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <p>${new Date(item.dt_txt).getHours()}:00</p>
      <h4>${Math.round(item.main.temp)}°</h4>
    `;

    hourlyEl.appendChild(div);
  });
}

/* 📅 5 DAY */
function displayForecast(list) {
  forecastEl.innerHTML = "";

  const filtered = list.filter(i => i.dt_txt.includes("12:00:00"));

  filtered.forEach(item => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <p>${new Date(item.dt_txt).toDateString().slice(0,10)}</p>
      <h4>${Math.round(item.main.temp)}°</h4>
    `;

    forecastEl.appendChild(div);
  });
}