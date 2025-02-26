const container = document.querySelector(".container");
const search = document.querySelector(".search-box button");
const weatherBox = document.querySelector(".weather-box");
const weatherDetails = document.querySelector(".weather-details");
const error404 = document.querySelector(".not-found");

async function callAPI(city) {
  try {
    const APIKey = "2840a64a04cf0b26316124aaeb221815";
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`
    );
    const data = await response.json();

    if (response.status === 404 || data.cod === "404") {
      console.error("Cidade não encontrada:", data);
      showError();
      return null;
    }

    if (!response.ok) {
      console.error("Erro ao buscar a API:", data);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Erro na consulta da API", error);
    return null;
  }
}

function showError() {
  container.style.height = "400px";
  weatherBox.style.display = "none";
  weatherDetails.style.display = "none";
  error404.style.display = "block";
  error404.classList.add("fadeIn");
}

function updateWeather(api) {
  const image = document.querySelector(".weather-box img");
  const temperature = document.querySelector(".weather-box .temperature");
  const description = document.querySelector(".weather-box .description");
  const humidity = document.querySelector(".weather-details .humidity span");
  const wind = document.querySelector(".weather-details .wind span");

  const weatherImages = {
    Clear: "images/clear.png",
    Rain: "images/rain.png",
    Snow: "images/snow.png",
    Clouds: "images/cloud.png",
    Haze: "images/mist.png",
  };

  image.src = weatherImages[api.weather[0].main] || "";

  temperature.innerHTML = `${parseInt(api.main.temp)}<span>°C</span>`;
  description.innerHTML = `${api.weather[0].description}`;
  humidity.innerHTML = `${api.main.humidity}%`;
  wind.innerHTML = `${parseInt(api.wind.speed)}Km/h`;

  weatherBox.style.display = "";
  weatherDetails.style.display = "";
  weatherBox.classList.add("fadeIn");
  weatherDetails.classList.add("fadeIn");
  container.style.height = "590px";
}

search.addEventListener("click", async function () {
  const city = document.querySelector(".search-box input").value.trim().replace(/\s+/g, ' ');

  if (city === "") {
    return;
  }

  const API = await callAPI(city);

  if (API) {
    error404.style.display = "none";
    error404.classList.remove("fadeIn");

    updateWeather(API);
  }
});

document
  .querySelector(".search-box input")
  .addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      document.querySelector(".search-box button").click();
    }
  });
