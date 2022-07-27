const baseURL = 'https://api.openweathermap.org/data/2.5/weather?q=';
const apiKey = '&appid=0b9d0a826b73f811d3ab2f7639e2f5ec';

document.getElementById('generate').addEventListener('click', performAction);

function performAction(e) {
    e.preventDefault();
    const form = document.forms["journalForm"]["feelings"].value;
    if (form == "") {
        alert("Please describe your mood today.");
        return false;
    } else {
        const city = document.getElementById('city').value;
        const journalEntry = document.getElementById('feelings').value;
        getWeather(baseURL, city, apiKey)
        .then(data => {
            postData('/addEntry', { data: data, mood: journalEntry });
            updateUI();
        });
    };
    clearResults();
};
 
const getWeather = async (baseURL, city, key) => {
    const response = await fetch(baseURL+city+key);
    const data = await response.json();
    try {
        return {
            city: data.name,
            country: data.sys.country,
            temp: data.main.temp,
            description: data.weather[0].description,
            icon: data.weather[0].icon
        };
    } catch (error) {
        console.log("Error", error);
    };
};

const postData = async (url = '', data = {}) => {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    try {
        const getData = await response.json();
        return getData;
    } catch (error) {
        console.log("Error:", error);
    };
};

// Update UI
const updateUI = async () => {
    const request = await fetch('/all');
    try {
        const allData = await request.json();
        for(let i = 0; i < allData.length; i++) {
            const data = allData[i].data;
            const mood = allData[i].mood;
            let d = new Date();
            const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            const cTemp = document.getElementById('celsius');
            const fTemp = document.getElementById('fahrenheit');
            const tempSection = document.querySelector('.temp');
            let degree = document.querySelector('.degree');

            // Formula to convert Kelvin to Celcius
            let celsius = data.temp - 273.15;

            // Formula to convert Celcius to Fahrenheit
            let fahrenheit = (celsius * 1.8) + 32;

            document.querySelector('.journal-entry').textContent = `Journal Entry #${i+1}`;
            document.querySelector('.current-date').textContent = `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}, ${d.getFullYear()}`;
            document.querySelector('.name').textContent = `${data.city}, ${data.country}`;
            document.querySelector('.current-weather').textContent = `${data.description}`;
            document.querySelector('.weather-icon').src = `http://openweathermap.org/img/w/${data.icon}.png`;
            document.querySelector('.mood').textContent = `${mood}`;
            degree.textContent = `${Math.floor(celsius)}`;
            tempSection.style.visibility = 'visible';

            cTemp.addEventListener('click', () => {
                degree.textContent = Math.floor(celsius);
            });

            fTemp.addEventListener('click', () => {
                degree.textContent = Math.floor(fahrenheit);
            });
        }
    } catch (error) {
        console.log("Error", error);
        alert('City/State not found');
    };
};

function clearResults() {
    const form = document.forms["journalForm"];
    form.reset();
};