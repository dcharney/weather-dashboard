const apiKey = "63db3938e3ac243baca7c44aa5400f00";
var userFormEl = $("#citySearch");

var getIndex = function(response) {
    // takes the json response data from the api fetch and returns the index value where the day changes
    // data is reported every 3 hours
    var idx = 0
    for (i=1;i<response.list.length;i++) {
        var currentTime = new Date(response.list[i].dt*1000);
        var lastTime = new Date(response.list[i-1].dt*1000);
        if (currentTime.getDay() != lastTime.getDay()) {
            if (i == 8) {
                idx = 0;
                return idx;
            } else {
                idx = i;
                return idx;
            };
        };
    };
};

var updateCurrentWeather = function(response) {
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
    var locationArr = {
        lat: response.coord.lat,
        long: response.coord.lon
    }
    
    return locationArr;
}; 

var updateUVIndex = function(val) {
    // get current UV value and style element accordingly
    var uvEl = $("#currentUV");
    uvEl.text(val);

    if (currentUV < 3) {
        uvEl.addClass("bg-success text-light p-2 rounded");
    } else if (currentUV < 6) {
        uvEl.addClass("bg-warning text-light p-2 rounded");
    } else {
        uvEl.addClass("bg-danger text-light p-2 rounded");
    };
};

var getCurrentWeather = function(cityName) {
    var cityContainerEl = $("#currentCity");
    cityContainerEl.text(cityName);
    
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=" + apiKey;

    fetch(apiUrl).then(function(response) {
        // only continue if valid city data
        if (response.ok) {
            response.json().then(function(response) {
                var location = updateCurrentWeather(response);
                get5DayForecast(cityName);
                
                var apiUrlUV = "http://api.openweathermap.org/data/2.5/uvi?lat=" + location.lat  + "&lon=" + location.long + "&appid=" + apiKey;
                return fetch(apiUrlUV);
            }).then(function(response) {
                response.json().then(function(response) {
                    updateUVIndex(response.value);
                });
            });
        } else {
            alert("City not found");
        };
    }).catch(function(error) {
        alert("Unable to connect to OpenWeather");
    })
};

var get5DayForecast = function(cityName) {
    var forecastContainerEl = $("#day-forecast");
    // clear any existing data
    forecastContainerEl.html("");
    
    var apiUrl = "http://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=imperial&appid=" + apiKey;

    fetch(apiUrl).then(function(response) {
        // dont need if response ok since already checked earlier
        response.json().then(function(response) {
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
    }).catch(function(error) {
        alert("Unable to connect to OpenWeather");
    })
};

var formSubmitHandler = function(event) {
    //event.preventDefault();

    var city = $("#citySearch").val();

    if (city) {
        getCurrentWeather(city);
    } else {
        alert("please enter a city");
    }
};

$("#submit-btn").click(formSubmitHandler);
$('#citySearch').keypress(function(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13'){
        formSubmitHandler();  
    }
});