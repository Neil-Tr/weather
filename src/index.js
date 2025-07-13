import "./styles.css";
import loadLocal from "./modules/load";
import saveLocal from "./modules/save";

async function getData(location, unit) {
  const apiKey = "WZP6HZRJFZD66FKTJHN88MESZ";
  const response = await fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=${unit}&include=days%2Chours%2Calerts%2Ccurrent&key=${apiKey}&contentType=json`
  );
  const locationData = await response.json();
  return locationData;
}

function processData(data) {
  let processed = {
    location: data.resolvedAddress,
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
  today.forEach((value) => (processed[value] = data.currentConditions[value]));
  processed["tempmax"] = data.days[0].tempmax;
  processed["tempmin"] = data.days[0].tempmin;

  let week = ["datetime", "condition", "tempmax", "tempmin", "icon"];
  processed.forecast = {};
  for (let i = 0; i <= 5; i++) {
    processed.forecast[i] = {};
    week.forEach(
      (value) => (processed.forecast[i][value] = data.days[i][value])
    );
  }
  return processed;
}
//render data, input: location
function render(data) {}

//save selection with 4 locations to local storage
function saveSelection() {}

const selection = loadLocal();
getData("Sydney", "metric").then((data) => {
  const processed = processData(data);
  console.log(processed);
});
