async function getWeather(lat, lon) {
    let key = '4a500f8e992c1e2de79cdb2e8d9dbf77';
    let fetchCall = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${key}`;
    let response = await fetch(fetchCall);
    let weatherObj = await response.json();
    console.log(weatherObj);
    return weatherObj;
}