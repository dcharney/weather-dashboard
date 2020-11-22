const apiKey = "63db3938e3ac243baca7c44aa5400f00";


var getWeather = function(cityName) {
    var cityContainerEl = document.querySelector("#currentCity");
    cityContainerEl.textContent = cityName;
    
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=" + apiKey;

    fetch(apiUrl).then(function(response) {
        return response.json();
    }).then(function(response) {
        // grab html elements
        var dateContainerEl = document.querySelector("#currentDate");
        var tempContainerEl = document.querySelector("#currentTemp");
        var humidityContainerEl = document.querySelector("#currentHumidity");
        var windSpeedContainerEl = document.querySelector("#currentWindSpeed");

        // parse desired data from fetch response
        var currentTemp = response.main.temp;
        var currentHumidity = response.main.humidity;
        var currentWindSpeed = response.wind.speed;
        var currentTimeCodeUnix = response.dt;
        var currentDate = new Date(currentTimeCodeUnix*1000).toLocaleDateString("en-US");

        // assign data to html
        dateContainerEl.textContent = currentDate;
        tempContainerEl.textContent = currentTemp;
        humidityContainerEl.textContent = currentHumidity;
        windSpeedContainerEl.textContent = currentWindSpeed;

        // print data to screen
        var currentTimeCodeUnix = response.dt;
        var s = new Date(currentTimeCodeUnix*1000).toLocaleDateString("en-US")

        // get UV Index using 
        var currentLat = response.coord.lat;
        var currentLong = response.coord.lon;
        var apiUrlUV = "http://api.openweathermap.org/data/2.5/uvi?lat=" + currentLat  + "&lon=" + currentLong + "&appid=" + apiKey;

        return fetch(apiUrlUV);
    }).then(function(response) {
        return response.json();
        //var currentUV = response.main.temp;
    }).then(function(response) {
        var uvContainerEl = document.querySelector("#currentUV");
        var currentUV = response.value;
        uvContainerEl.textContent = currentUV;
    });
};

getWeather("Atlanta");