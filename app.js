const KEYS = {
    weather: '4a500f8e992c1e2de79cdb2e8d9dbf77',
    location: 'AIzaSyCl5hk7crlR_9eSjnZK2W-nfvYNOEhdHhY'
};

var PAGE = {
    input: document.getElementById("main-input"),
    currentWeather: {
        this: document.querySelector("#current"),
        imageDiv: document.querySelector(".left *#img-content"),
        cityName: document.querySelector("#current *#city-name"),
        weatherDesc: document.querySelector("#current *#weather-desc"),
        temp: document.querySelector("#current *#temp"),
        humidity: document.querySelector("#current *#humidity"),
        windSpeed: document.querySelector("#current *#wind-speed"), 
    },
    cityWeather: {
        this: document.querySelector("#other"),
        imageDiv: document.querySelector(".right *#img-content"),
        cityName: document.querySelector("#other *#city-name"),
        weatherDesc: document.querySelector("#other *#weather-desc"),
        temp: document.querySelector("#other *#temp"),
        humidity: document.querySelector("#other *#humidity"),
        windSpeed: document.querySelector("#other *#wind-speed"),
    },
    submit: document.getElementById("input-submit-button")
}


async function getWeather(lat, lon) {
    let key = KEYS.weather;
    let fetchCall = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${key}`;
    let response = await fetch(fetchCall);
    let weatherObj = await response.json();
    console.log(weatherObj);
    return weatherObj;
}

async function getCityName(lat, lon) {
    let key = KEYS.location;
    let fetchCall = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${key}`;
    let response = await fetch(fetchCall);
    let locationObj = await response.json();
    return locationObj.results;
}

async function getCoords(address) {
    let key = KEYS.location;
    let fetchCall = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(address)}&key=${key}`;
    let response = await fetch(fetchCall);
    let locationObj = await response.json();
    return locationObj;
}

function formatAddress(addressObject) {
    var address;
    if ("results" in addressObject) {
        address = addressObject.results[1].formatted_address;
    }
    else {
        address = addressObject[1].formatted_address;
    }
    return address;
}

async function formatWeatherData(weatherObj, city) {
    let current = weatherObj.current;
    return {
        cityName: formatAddress(city),
        weatherDesc: `Weather: ${current.weather[0].description}`,
        weatherType: current.weather[0].main,
        temp: `Temperature: ${(current.temp * (9/5) - 459.67).toFixed(2)}°F`,
        humidity: `Humidity: ${current.humidity}%`,
        windSpeed: `Wind Speed: ${current.wind_speed} MPH`
    };
}

async function setCurrentWeather(position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    let city = await getCityName(lat, lon);
    setWeather([lat, lon], city, PAGE.currentWeather);
}

async function setOtherWeather() {
    let address = PAGE.input.value;
    let coords = await getCoords(address);
    coords = Object.values(coords.results[0].geometry.location);
    address = await getCityName(coords[0], coords[1]);
    setWeather(coords, address, PAGE.cityWeather);
}

async function setWeather(coords, cityName, div) {
    
    [lat, long] = coords; 
    let weatherObj = await getWeather(lat, long);
    let data = await formatWeatherData(weatherObj, cityName);
    clearInterval(div.animation);
    Array.from(div.this.children).forEach(function(child) {
        if (child.classList.contains('content-loading-bar')) {
            child.remove();
        }
    })
    console.log(div.imageDiv);
    div.imageDiv.style.backgroundImage = `url(images/${data.weatherType}.jpg)`;
    div.cityName.textContent = data.cityName;
    div.weatherDesc.textContent = data.weatherDesc;
    div.temp.textContent = data.temp;
    div.humidity.textContent = data.humidity;
    div.windSpeed.textContent = data.windSpeed;
}

async function init() {
    [PAGE.cityWeather, PAGE.currentWeather].forEach(function(thisDiv) {
        thisDiv.animationRows = 0;
        thisDiv.animation = setInterval(function(div = thisDiv) {
            let loadingDiv = document.createElement("div");
            let width = 60 + (Math.random() * 20);
            width = `${width}%`;
            loadingDiv.style.width = width;
            loadingDiv.classList.add('content-loading-bar');
            if (div.animationRows < 6) {
                div.this.appendChild(loadingDiv);
                div.animationRows++;
            }
            else clearInterval(div.animation);
        }, 200);
    })
    navigator.geolocation.getCurrentPosition(setCurrentWeather);
    PAGE.submit.onclick = setOtherWeather;
    PAGE.input.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            setOtherWeather();
        }
    })

}

init();