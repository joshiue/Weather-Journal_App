//Personal Key for OpenweatherMap API
const baseURL = "https://api.openweathermap.org/data/2.5/weather?q=";
const zip = "zip=94040,us";
const apiKey = "&appid=0b9d0a826b73f811d3ab2f7639e2f5ec&units=imperial";

document.getElementById("generate").addEventListener("click", performAction);

function performAction(e) {
  e.preventDefault();
  const form = document.forms["journalForm"]["feelings"].value;
  if (form == "") {
    alert("How you feel today.");
    return false;
  } else {
    const city = document.getElementById("city").value;
    const journalEntry = document.getElementById("feelings").value;
    getWeather(baseURL, city, apiKey, zip).then((data) => {
      postData("/addEntry", { data: data, mood: journalEntry });
      journal();
    });
  }
  clearResults();
}

const getWeather = async (baseURL, city, key, zip) => {
  const response = await fetch(baseURL + city + key + zip);
  const data = await response.json();
  try {
    return {
      city: data.name,
      country: data.sys.country,
      temp: data.main.temp,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
    };
  } catch (error) {
    console.log("Error", error);
  }
};

const postData = async (url = "", data = {}) => {
  const response = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  try {
    const getData = await response.json();
    return getData;
  } catch (error) {
    console.log("Error:", error);
  }
};

// Weather Journal log
const journal = async () => {
  const request = await fetch("/all");
  try {
    const entries = await request.json();
    for (let i = 0; i < entries.length; i++) {
      const data = entries[i].data;
      const mood = entries[i].mood;
      let d = new Date();
      const days_of_week = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const c = document.getElementById("celsius");
      const f = document.getElementById("fahrenheit");
      const temp = document.querySelector(".temp");
      let degree = document.querySelector(".degree");

      // Kelvin to Celcius
      let celsius = data.temp - 273.15;

      // Celcius to Fahrenheit
      let fahrenheit = celsius * 1.8 + 32;

      document.querySelector(".journal-entry").innerHTML = `WEATHER STATUS`;
      document.querySelector(".date").innerHTML = `${d.getFullYear()} ${
        months[d.getMonth()]
      } ${d.getDate()} ${days_of_week[d.getDay()]}`;
      document.querySelector(
        ".icon"
      ).src = `http://openweathermap.org/img/w/${data.icon}.png`;
      document.querySelector(
        ".current-weather"
      ).innerHTML = `${data.description}`;
      document.querySelector(
        ".name"
      ).innerHTML = `${data.city}, ${data.country}`;
      document.querySelector(".mood").innerHTML = `${mood}`;
      degree.innerHTML = `${Math.floor(celsius)}`;

      c.addEventListener("click", () => {
        degree.innerHTML = Math.floor(celsius);
      });

      f.addEventListener("click", () => {
        degree.innerHTML = Math.floor(fahrenheit);
      });
    }
  } catch (error) {
    console.log("Error", error);
    alert("City/State not found");
  }
};

function clearResults() {
  const form = document.forms["journalForm"];
  form.reset();
}
