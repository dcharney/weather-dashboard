const apiKey = "63db3938e3ac243baca7c44aa5400f00";

var getIndex = function(response) {
    // takes the json response data from the api fetch and returns the index value where the day changes
    // data is reported every 3 hours
    var idx = 0
    for (i=1;i<response.list.length;i++) {
        var currentTime = new Date(response.list[i].dt*1000);
        var lastTime = new Date(response.list[i-1].dt*1000);
        if (currentTime.getDay() != lastTime.getDay()) {
            idx = i;
            return idx;
        };
    };
};

var getCurrentWeather = function(cityName) {
    var cityContainerEl = $("#currentCity");
    cityContainerEl.text(cityName);
    
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=" + apiKey;

    fetch(apiUrl).then(function(response) {
        return response.json();
    }).then(function(response) {
        // grab html elements
        var dateEl = $("#currentDate");
        var tempEl = $("#currentTemp");
        var humidityEl = $("#currentHumidity");
        var windSpeedEl = $("#currentWindSpeed");
        var iconEl = $("#currentIcon");

        // parse desired data from fetch response
        var currentTemp = response.main.temp;
        var currentHumidity = response.main.humidity;
        var currentWindSpeed = response.wind.speed;
        var currentTimeCodeUnix = response.dt;
        var currentDate = new Date(currentTimeCodeUnix*1000).toLocaleDateString("en-US");
        var currentIcon = response.weather[0].icon;
        
        // assign data to html
        dateEl.text(currentDate);
        tempEl.text(currentTemp);
        humidityEl.text(currentHumidity);
        windSpeedEl.text(currentWindSpeed);
        iconEl.attr("src", "http://openweathermap.org/img/w/" + currentIcon + ".png");

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
        var uvEl = $("#currentUV");
        var currentUV = response.value;
        uvEl.text(currentUV);
        if (currentUV < 3) {
            uvEl.addClass("bg-success text-light p-2 rounded");
        } else if (currentUV < 6) {
            uvEl.addClass("bg-warning text-light p-2 rounded");
        } else {
            uvEl.addClass("bg-danger text-light p-2 rounded");
        };
    });
};

var get5DayForecast = function(cityName) {
    var forecastContainerEl = $("#day-forecast");
    // clear any existing data
    forecastContainerEl.html("");
    
    var apiUrl = "http://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=imperial&appid=" + apiKey;

    fetch(apiUrl).then(function(response) {
        return response.json();
    }).then(function(response) {
        // build 
        // variable to hold index of the first date change
        var idx = getIndex(response);

        for (i=0;i<5;i++) {
            // based on the index value above, find the index value for the 5 days (add 4 so the printed data values are for the middle of the day)
            var actualIdx = i * 8 + idx + 4;

            // get data from api at Unix and convert
            var timeCodeUnix = response.list[actualIdx].dt;
            var time = new Date(timeCodeUnix*1000).toLocaleDateString("en-US");
            var icon = response.list[actualIdx].weather[0].icon;
            var temp = response.list[actualIdx].main.temp;
            var humidity = response.list[actualIdx].main.humidity;

            var cardEl = $("<div>").addClass("col-2 card bg-primary pt-2");
            var cardTitleEl = $("<h5>").addClass("card-title").text(time);
            var divEl = $("<div>").addClass("weather-icon");
            var cardIconEl = $("<img>").addClass("p-2").attr("src","http://openweathermap.org/img/w/" + icon + ".png");
            var cardTempEl = $("<p>").addClass("card-text").text("Temp: " + temp + " " + String.fromCharCode(176) + "F");
            var cardHumidityEl = $("<p>").addClass("card-text mb-2").text("Humidity: " + humidity + "%");

            cardEl.append(cardTitleEl);
            divEl.append(cardIconEl);
            cardEl.append(divEl);
            cardEl.append(cardTempEl);
            cardEl.append(cardHumidityEl);
            forecastContainerEl.append(cardEl);
        }
    });
        
};

getCurrentWeather("Orlando");

get5DayForecast("Orlando");