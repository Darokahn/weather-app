async function getWeather() {
    let fetchCall = "https://api.openweathermap.org/data/3.0/onecall?lat=33.44&lon=-94.04&appid=4a500f8e992c1e2de79cdb2e8d9dbf77";
    let weatherObj = await fetch(fetchCall);
    console.log(weatherObj);
    return weatherObj;
}

