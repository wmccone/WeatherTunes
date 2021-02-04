//Weather APP Code

// Display current city in header of the Weather Element
// Display current weather condition in the text of the Weather Element
var currentCityName = document.querySelector("#currentcity")
var currentTempurature = document.querySelector("#cur-temp")
var currentHumidity = document.querySelector("#cur-humid")
var currentWindSpeed = document.querySelector("#cur-wndspeed")
var currentDateEl = document.querySelector("#currentdate")
var currentWeatherEl = document.querySelector("#currentweather")
var dateVar = moment().format('L');
var apiKey = "86be0edea7b654b425b0a2a7b7fa2fe5"
var currentWeatherCondition = ""

function printCurrentWeather(result) {
    currentWeatherCondition = result.weather[0].main
    currentCityName.textContent = result.name + ": "
    currentTempurature.textContent = "Temperature: " + result.main.temp + "°F"
    currentHumidity.textContent = "Humidity : " + result.main.humidity + "%"
    currentWindSpeed.textContent = "Wind Speed: " + result.wind.speed + " MPH"
    currentDateEl.textContent = dateVar
    var iconLoc = "https://openweathermap.org/img/wn/" + result.weather[0].icon + "@2x.png"
    currentWeatherEl.setAttribute("src", iconLoc)
    console.log(currentWeatherCondition)
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
    }



//Music APP Code
//Receive the weather condition into the Playlist function

var iframeElement   = document.querySelector('iframe');
var iframeElementID = iframeElement.id;
var widget1         = SC.Widget(iframeElement);
var widget2         = SC.Widget(iframeElementID);
// widget1 === widget2



//Background APP code
//Create a function that receives weather condition and adds a new background based off of that condition







//Form Code

//Submit listener
var submitBtn = document.querySelector(".btn-submit");
//input value is assigned a variable
var cityInput = document.querySelector("input");
var cityListEl = document.querySelector("#city-list");
var pastCityNames = [];
var cityName;

submitBtn.addEventListener("click", function(event){

    event.preventDefault();

    cityName = cityInput.value;

    if(cityName != ""){
        // clears buttons 
        cityListEl.innerHTML = "";
        // add to array for storage
        pastCityNames.push(cityName);
        addPastCity();

    }
    searchWeatherApi(cityName)

});

function addPastCity(){
    // create buttons for each city thats been searched
    for (var i = 0; i < pastCityNames.length ; i ++){

        var newCityEl = document.createElement("button");
        newCityEl.textContent = pastCityNames[i];

        var newLineEl = document.createElement("br")

        cityListEl.append(newCityEl);
        cityListEl.append(newLineEl);
    }

    storeCities();

}

function storeCities(){
    localStorage.setItem("storedCities", JSON.stringify(pastCityNames));
}

function init(){
    var storedCities = JSON.parse(localStorage.getItem("storedCities"));

    if(storedCities != null){
        pastCityNames = storedCities;
        addPastCity();
    }
}

init();


