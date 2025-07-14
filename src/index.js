import "./styles.css";
import loadLocal from "./modules/load";
import saveLocal from "./modules/save";
import magnifyIcon from "./asset/magnify.svg";
import thermometerIcon from "./asset/thermometer-lines.svg";
import waterIcon from "./asset/water-percent.svg";
import pouringIcon from "./asset/weather-pouring.svg";
import windyIcon from "./asset/weather-windy.svg";
import dustIcon from "./asset/weather-dust.svg";

async function getData(location, unit) {
  const apiKey = "WZP6HZRJFZD66FKTJHN88MESZ";
  const response = await fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=${unit}&include=days%2Chours%2Calerts%2Ccurrent&key=${apiKey}&contentType=json`
  );
  const locationData = await response.json();
  locationData.degree = unit === "metric" ? "&#176" : "&#176F";
  locationData.speed = unit === "metric" ? "kmh" : "mph";
  console.log(locationData);
  return locationData;
}

async function processData(data) {
  if (!data) {
    return null;
  }
  let processed = {
    location: data.resolvedAddress || "N/A",
    timezone: data.timezone || "N/A",
    degree: data.degree || "N/A",
    speed: data.speed || "N/A",
  };
  let today = [
    "datetime",
    "temp",
    "conditions",
    "tempmax",
    "tempmin",
    "feelslike",
    "humidity",
    "precipprob",
    "windspeed",
    "windgust",
    "icon",
  ];
  today.forEach(
    (value) => (processed[value] = data.currentConditions[value] || "N/A")
  );
  processed["tempmax"] = data.days[0].tempmax || "N/A";
  processed["tempmin"] = data.days[0].tempmin || "N/A";

  let week = ["datetime", "conditions", "tempmax", "tempmin", "icon"];
  processed.forecast = {};
  for (let i = 0; i <= 5; i++) {
    processed.forecast[i] = {};
    week.forEach(
      (value) => (processed.forecast[i][value] = data.days[i][value])
    );
  }
  try {
    if (processed.timezone !== "N/A") {
      const timeRes = await fetch(
        `https://timeapi.io/api/Time/current/zone?timeZone=${encodeURIComponent(
          processed.timezone
        )}`
      );
      if (timeRes.ok) {
        const timeData = await timeRes.json();
        processed.currentTime = timeData.time || "Unavailable";
        processed.dayOfWeek = timeData.dayOfWeek || "Unavailable";
      } else {
        console.error("Time API error:", timeRes.status);
        processed.currentTime = "Unavailable";
      }
    } else {
      processed.currentTime = "Unavailable";
    }
  } catch (err) {
    console.error("Failed to fetch current time:", err);
    processed.currentTime = "Unavailable";
  }

  return processed;
}

function renderIcon(iconName, altText = "") {
  return `<img src="https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/SVG/4th%20Set%20-%20Color/${iconName}.svg" alt="${altText}" title ="${altText}"/>`;
}

//render data, input: location
function renderLocation(container, data) {
  const mainInfo = container.querySelector(".mainInfo");
  mainInfo.innerHTML = `
  <h1>${data.dayOfWeek} | ${data.currentTime}</h1>
  <div class=tempIcon><h1>${data.temp}${data.degree}</h1>
  <div class="mainIcon">${renderIcon(data.icon, data.conditions)}
  </div>
  </div>
    <h3> ${data.conditions}</h3>
    <h5>${data.location} </h5>
    `;
  container.querySelector(
    ".feelsLike"
  ).innerHTML = `${data.feelslike}${data.degree}`;
  container.querySelector(".humidity").innerHTML = `${data.humidity}%`;
  container.querySelector(".precipprob").innerHTML = `${data.precipprob}%`;
  container.querySelector(
    ".windSpeed"
  ).innerHTML = `${data.windspeed} ${data.speed}`;
  container.querySelector(".gust").innerHTML = `${data.windgust} ${data.speed}`;
  const nextDays = container.querySelector(".nextDays");
  for (let i = 0; i <= 4; i++) {
    const nextDay = document.createElement("div");
    nextDay.className = "nextDay";
    nextDay.innerHTML = `
    <h4>${data.forecast[i].datetime}</h4>
    <div class="nextDayIcon">${renderIcon(
      data.forecast[i].icon,
      data.forecast[i].conditions
    )}</div>
    <p>${data.forecast[i].tempmin}${data.degree} - ${data.forecast[i].tempmax}${
      data.degree
    }</p>
    `;
    nextDays.appendChild(nextDay);
  }
}

function renderTemplate() {
  const container = document.querySelector(".container");
  const cityBox = document.createElement("div");
  cityBox.classList.add("cities");

  cityBox.innerHTML = `
  <div class="searchBox">
    <input class="location" placeholder="Search for location" />
    <img class="searchButton icon" src=${magnifyIcon} />
  </div>
  <div class="info">
    <div class="mainInfo"></div>
    <div class="sideInfo">
        <img class="icon" src=${thermometerIcon} />
        <p>Feels Like</p>
        <p class="feelsLike"></p>
    </div>
    <div class="sideInfo">
        <img class="icon" src=${waterIcon} />
        <p>Humidity</p>
        <p class="humidity"></p>
    </div>
    <div class="sideInfo">
        <img class="icon" src=${pouringIcon} />
        <p>Chance of Rain</p>
        <p class="precipprob"></p>
    </div>
    <div class="sideInfo">
        <img class="icon" src=${windyIcon} />
        <p>Wind Speed</p>
        <p class="windSpeed"></p>
    </div>
    <div class="sideInfo">
        <img class="icon" src=${dustIcon} />
        <p>Wind Gust</p>
        <p class="gust"></p>
    </div>
  </div>
  <div class="nextDays">
  </div>
`;
  container.appendChild(cityBox);
  return cityBox;
}
//save selection with 4 locations to local storage
function saveSelection() {
  const unit =
    document.querySelector(".toggleCf").textContent === "°C" ? "metric" : "us";
  const locationElements = document.querySelectorAll(".mainInfo h5");
  const locations = Array.from(locationElements).map((el) => el.textContent);
  const selections = {
    unit: unit,
    locations: locations,
  };
  localStorage.setItem("selections", JSON.stringify(selections));
}
const saveButton = document.querySelector(".saveSelection");
saveButton.addEventListener("click", saveSelection);

const selection = loadLocal();

const buttonCf = document.querySelector(".toggleCf");
buttonCf.textContent = selection.unit === "metric" ? "°C" : "°F";
buttonCf.addEventListener("click", () => {
  selection.unit = selection.unit === "metric" ? "us" : "metric";
  // Update button label
  buttonCf.textContent = selection.unit === "metric" ? "°C" : "°F";
  pageRender(selection);
});

pageRender(selection);
function pageRender(selection) {
  const container = document.querySelector(".container");
  container.innerHTML = "";
  selection.locations.forEach(async (city) => {
    const cityBox = renderTemplate();
    try {
      const data = await getData(city, selection.unit);
      const processed = await processData(data);
      renderLocation(cityBox, processed);
      console.log(processed);
    } catch (err) {
      console.error(`Failed to load data for ${city}:`, err);
    }
  });
}
