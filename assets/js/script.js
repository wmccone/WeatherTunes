//Weather APP Code

// Display current city in header of the Weather Element
// Display current weather condition in the text of the Weather Element
var currentCityName = document.querySelector("#currentcity");
var currentTempurature = document.querySelector("#cur-temp");
var currentHumidity = document.querySelector("#cur-humid");
var currentWindSpeed = document.querySelector("#cur-wndspeed");
var currentDateEl = document.querySelector("#currentdate");
var currentWeatherEl = document.querySelector("#currentweather");
var dateVar = moment().format('L');
var apiKey = "86be0edea7b654b425b0a2a7b7fa2fe5";
var currentWeatherCondition = "";

function printCurrentWeather(result) {
    currentWeatherCondition = result.weather[0].main
    currentCityName.textContent = result.name + ": "
    currentTempurature.textContent = "Temperature: " + result.main.temp + "°F"
    currentHumidity.textContent = "Humidity : " + result.main.humidity + "%"
    currentWindSpeed.textContent = "Wind Speed: " + result.wind.speed + " MPH"
    currentDateEl.textContent = dateVar
    var iconLoc = "https://openweathermap.org/img/wn/" + result.weather[0].icon + "@2x.png"
    currentWeatherEl.setAttribute("src", iconLoc)
    console.log(currentWeatherCondition);
    changeBackground(currentWeatherCondition);

    return currentWeatherCondition
}

// This function is going to search the Open Weather API for the fields associated with the city
function searchWeatherApi(query) {
    var cityName = query
    var locationURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial" + "&appid=" + apiKey

    fetch(locationURL)
        .then(function (response) {
            // If API does not respond throw up an error
            if (!response.ok) {
                throw response.json();
            }

            return response.json();
        })
        .then(function (locationres) {

            // If location does not exist throw up a message to the user.
            if (!locationres) {

                console.log("no results found")
                return
            }
            //Once API repsonds print the conditions
            else {
                printCurrentWeather(locationres)
            }
        })
        //Catches earlier response to throw up an error
        .catch(function (error) {
            console.error(error);
        });
}


//Music APP Code
var videoControlsEl = document.querySelector("#video-controls")
var musicWidgetEl = document.querySelector("iframe");
var googopener = "AIzaSyAb9dAwTdMAi7MJtXWXB7L1536q-F72RTk";
// create a function to update the music to the page
function printMusic(results) {
    console.log("results", results);
    // pick a random video
    var itemNumber = Math.floor(Math.random() * Math.floor(results.items.length));
    //this will help pull the video ID for the first video in the search results
    var musicID = results.items[itemNumber].id.videoId;
    var musicUrl = "https://www.youtube.com/embed/" + musicID;
    console.log(musicUrl);
    musicWidgetEl.setAttribute("src", musicUrl);
}

//Finish writing button
function writeMusicControls(object){
    videoControlsEl.innerHTML = ""

    var nextButton = document.createElement("button")
    nextButton.setAttribute("id", "btn-next");
    nextButton.textContent = "Play me another";
    videoControlsEl.appendChild(nextButton)
    nextButton.addEventListener("click",function (object) {
        printMusic(object)
    })
}

//Receive the weather condition into the fetch function

function searchMusicAPI(condition) {

    //fetches the first 5 video results for weather condition + lofi
    var youTubeFetch = "https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q="+condition+"%20lofi%20mix&key=" + googopener

    fetch(youTubeFetch)
        .then(function (response) {
            // If API does not respond throw up an error
            if (!response.ok) {
                throw response.json();
            }

            return response.json();
        })
        .then(function (music) {

            // If location does not exist throw up a message to the user.
            if (!music) {

                console.log("no results found");
                return
            }
            //Once API repsonds print the conditions
            else {
                console.log(music);
                printMusic(music);
                writeMusicControls(music)
            }
        })
        .catch(function (error) {
            console.error(error);
        });

}

function changeBackground(condition) {
    var weatherCondition;

    if (condition == "Clear" || condition == "Clouds") {
        document.body.style.backgroundImage = "url('./assets/images/sun.jpg')";
        weatherCondition = "Sunny";
    }
    else if (condition == "Drizzle" || condition == "Rain") {
        document.body.style.backgroundImage = "url('./assets/images/rain.jpg')";
        weatherCondition = "Rainy";
    }
    else if (condition == "Thunderstorm") {
        document.body.style.backgroundImage = "url('./assets/images/thunder.jpg')";
        weatherCondition = "Thunderstorm";
    }
    else if (condition == "Snow") {
        document.body.style.backgroundImage = "url('./assets/images/snow.jpg')";
        weatherCondition = "Snow";
    }
    else {
        document.body.style.backgroundImage = "url('./assets/images/fog.jpg')";
        weatherCondition = "Hazy";
    }

    searchMusicAPI(weatherCondition);
}

//Form Code
//Submit listener
var submitBtn = document.querySelector(".btn-submit");
//input value is assigned a variable
var cityInput = document.querySelector("input");
var cityListEl = document.querySelector("#city-list");
var pastCityNames = [];
var cityName;

submitBtn.addEventListener("click", function (event) {

    event.preventDefault();

    cityName = cityInput.value;

    if (cityName != "") {
        // clears buttons 
        cityListEl.innerHTML = "";
        // add to array for storage
        pastCityNames.push(cityName);
        addPastCity();

    }
    searchWeatherApi(cityName);

});

function addPastCity() {
    // create buttons for each city thats been searched
    for (var i = 0; i < pastCityNames.length; i++) {

        var newCityEl = document.createElement("button");
        newCityEl.setAttribute("class", "btn-city");
        newCityEl.textContent = pastCityNames[i];

        var newLineEl = document.createElement("br")

        cityListEl.append(newCityEl);
        cityListEl.append(newLineEl);
    }

    storeCities();

    //added event listeners for each city button that was created
    var cityBtn = document.querySelectorAll(".btn-city");
    cityBtn.forEach(function (cityBtn) {
        cityBtn.addEventListener("click", function () {
            var clickedCity = this.textContent;
            searchWeatherApi(clickedCity);
        })
    })
}

function storeCities() {
    localStorage.setItem("storedCities", JSON.stringify(pastCityNames));
}

function init() {
    var storedCities = JSON.parse(localStorage.getItem("storedCities"));

    if (storedCities != null) {
        pastCityNames = storedCities;
        addPastCity();
    }
}

init();


