let KEYS = {
    weather: '4a500f8e992c1e2de79cdb2e8d9dbf77',
    location: 'AIzaSyCl5hk7crlR_9eSjnZK2W-nfvYNOEhdHhY'
};


async function getWeather(lat, lon) {
    let key = KEYS.weather;
    let fetchCall = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${key}`;
    let response = await fetch(fetchCall);
    let weatherObj = await response.json();
    return weatherObj;
}

async function getCityName(lat, lon) {
    let key = KEYS.location;
    let fetchCall = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${key}`;
    let response = await fetch(fetchCall);
    let locationObj = await response.json();
    console.log(locationObj);
    return locationObj;
}

async function getCoords(address) {
    let key = KEYS.location;
    let fetchCall = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(address)}&key=${key}`;
    let response = await fetch(fetchCall);
    let locationObj = await response.json();
    console.log(locationObj);
    return locationObj;
}

async function init() {
    await getWeather(34, 100);
    await getCityName(34, -100);
    await getCoords("St. George, Utah");
}

init();