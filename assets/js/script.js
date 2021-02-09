//Weather APP Code

var currentCityName = document.querySelector("#currentcity");
var currentTempurature = document.querySelector("#cur-temp");
var currentHumidity = document.querySelector("#cur-humid");
var currentWindSpeed = document.querySelector("#cur-wndspeed");
var currentDateEl = document.querySelector("#currentdate");
var currentWeatherEl = document.querySelector("#currentweather");
var dateVar = moment().format('L');
var apiKey = "86be0edea7b654b425b0a2a7b7fa2fe5";
var currentWeatherCondition = "";
var playlistTextEl = document.querySelector("#playlist-text");

function printCurrentWeather(result) {
    // show text elements
    currentCityName.hidden = false;
    playlistTextEl.hidden = false;

    //erases input text
    cityInput.value= "";

    currentWeatherCondition = result.weather[0].main
    currentCityName.textContent = result.name + ": "
    // Display current weather condition in the text of the Weather Element
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
            if (response.status === 404){
                console.log("no city found")
                //erases input text
                cityInput.value= "";
                //This will tell the user to enter their info again if they use an invalit input for the weather fetch.
                currentCityName.textContent = "City not found, please re-enter city"
                //This will remove their invalid input from the storage array for the cities
                var cityindex = pastCityNames.indexOf(cityName)
                //removes the city in the array
                pastCityNames.splice(cityindex, 1)
                cityListEl.innerHTML = "";
                addPastCity();
                return
            }
            
            else if (!response.ok) {
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

var googopener = "AIzaSyC6AjZrA1QFsATo8QhRRXE2stCcwCIwomc";
var musicObject = []

// create a function to update the music to the page
function printMusic(results) {
    console.log("results", results);
    // pick a random video from the object
    var itemNumber = Math.floor(Math.random() * Math.floor(results.items.length));
    //this will help pull the video ID for the random video
    var musicID = results.items[itemNumber].id.videoId;
    // this will create the video link and add it to the iframe on the html
    var musicUrl = "https://www.youtube.com/embed/" + musicID;
    console.log(musicUrl);
    musicWidgetEl.setAttribute("src", musicUrl);
}

//This function will write a button that goes to a new video
function writeMusicControls(){
    //Clears the button section before writing it again
    videoControlsEl.innerHTML = ""
    //Adds the button to the page
    var nextButton = document.createElement("button")
    nextButton.setAttribute("class", "btn-next waves-effect waves-light btn indigo lighten-3");
    nextButton.textContent = "Play me another";
    videoControlsEl.appendChild(nextButton)
    //Assigns the button to reprint the music on print
    nextButton.addEventListener("click",function () {
        printMusic(musicObject)
    })
}

//Receive the weather condition into the fetch function

function searchMusicAPI(condition) {

    //fetches the first 10 video results for weather condition + lofi
    var youTubeFetch = "https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q="+condition+"%20lofi%20mix&key=" + googopener

    //   fetch(youTubeFetch)
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
                //Adds the music link to the iframe
                printMusic(music);
                //Sets the music object to a variable
                musicObject = music;
                //Starts writing the music controls to the page
                writeMusicControls(music);
                //Sends the music object to the global scope for use in writing the music controls.
                return musicObject

            }
        })
        .catch(function (error) {
            console.error(error);
        });
}
   


var weatherCondition;
function changeBackground(condition) {

    if (condition == "Clear" || condition == "Clouds") {
        document.body.style.backgroundImage = "url('./assets/images/sun.jpg')";
        weatherCondition = "Sunny";
        document.getElementById("rain").innerHTML = "";
        ;
    }
    else if (condition == "Drizzle" || condition == "Rain") {
        document.body.style.backgroundImage = "url('./assets/images/rain.jpg')";
        weatherCondition = "Rainy";
        makeItRain();
    }
    else if (condition == "Thunderstorm") {
        document.body.style.backgroundImage = "url('./assets/images/thunder.jpg')";
        weatherCondition = "Thunderstorm";
        makeItRain();
    }
    else if (condition == "Snow") {
        document.body.style.backgroundImage = "url('./assets/images/snow.jpg')";
        weatherCondition = "Snow";
        document.getElementById("rain").innerHTML = "";
        setInterval(makeItSnow, 50);
        makeItSnow();
    }
    else {
        document.body.style.backgroundImage = "url('./assets/images/fog.jpg')";
        weatherCondition = "Hazy";
        document.getElementById("rain").innerHTML = "";
    }

    searchMusicAPI(weatherCondition);
}

//Form Code
//Submit listener
var submitBtn = document.querySelector(".btn-submit");
//input value is assigned a variable
var cityInput = document.querySelector("input");
var cityListEl = document.querySelector("#city-list");
//This will be the Array used for storing city names to the local storage
var pastCityNames = [];
//This variable will store the input from the form
var cityName;

submitBtn.addEventListener("click", function (event) {

    event.preventDefault();
    //Stores the form input
    cityName = cityInput.value;
    //converts city name to lowercase to make inputs uniform
    cityName = cityName.toLowerCase()
    cityName = cityName.trim()
    //If array already contains the city remove the duplicate from the array.
    if (pastCityNames.includes(cityName)) {
        //finds the index of the duplicate in the array
        var cityindex = pastCityNames.indexOf(cityName)
        //removes the city in the array
        pastCityNames.splice(cityindex, 1)
        //Adds the new input at the top of the array
        pastCityNames.unshift(cityName)
        cityListEl.innerHTML = "";
        addPastCity();
    }
    //If user has 10 recent results remove the last one from the list and add the new one
    else if (cityName != "" && pastCityNames.length === 10) {
        //Removes the last index of the array
        pastCityNames.pop()
        //Adds the new input to the array
        pastCityNames.unshift(cityName)
        cityListEl.innerHTML = "";
        addPastCity();
    }
    //Will only accept an input if one exists in the form and the storage is less than 10 in length
    else if (cityName != "" && pastCityNames.length < 10) {
        // clears buttons 
        cityListEl.innerHTML = "";
        // add to array for storage
        pastCityNames.unshift(cityName);
        addPastCity();
    }
    
    searchWeatherApi(cityName);

});

//function will capitalize the first letter of the words printed
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

//function will write the city Array to the page
function addPastCity() {
    // create buttons for each city thats been searched
    for (var i = 0; i < pastCityNames.length; i++) {

        var newCityEl = document.createElement("button");
        newCityEl.setAttribute("class", "btn-city waves-effect waves-light btn indigo lighten-3");
        var city = capitalizeFirstLetter(pastCityNames[i])
        newCityEl.textContent = city;

        var newLineEl = document.createElement("br")

        cityListEl.append(newCityEl);
        cityListEl.append(newLineEl);
    }
    //Call the local storage function
    storeCities();

    //added event listeners for each city button that was created
    var cityBtn = document.querySelectorAll(".btn-city");
    cityBtn.forEach(function(cityBtn) {
        cityBtn.addEventListener("click", function(){ 
            var clickedCity = this.textContent;
            //setting 
            clickedCity = clickedCity.toLowerCase()
            searchWeatherApi(clickedCity);
            //Finds the index of the city clicked in the storage array
            var arrayLoc = pastCityNames.indexOf(clickedCity)
            //removes the index where the city was
            pastCityNames.splice(arrayLoc, 1)
            //adds the city back into the top of the array
            pastCityNames.unshift(clickedCity)
            //rewrites the buttons on the page
            cityListEl.innerHTML = "";
            addPastCity();
        })
    })
}
//Function will add cities to local storage
function storeCities() {
    localStorage.setItem("storedCities", JSON.stringify(pastCityNames));
}

function init() {
    // sets the intial wallpaper
    document.body.style.backgroundImage = "url('./assets/images/wavy.jpg')";

    //hide text elements
    currentCityName.hidden = true;
    playlistTextEl.hidden = true;

    var storedCities = JSON.parse(localStorage.getItem("storedCities"));

    if (storedCities != null) {
        pastCityNames = storedCities;
        //Will pull the buttons onto the page on load
        addPastCity();
        //Will pull the last city searched onto the page for the weather
        searchWeatherApi(storedCities[0])
    }
}

init();

// Rain animation function
function makeItRain () {
    var zrain = document.createElement("div");
    zrain.classList.add("rainy");
    document.getElementById("rain").appendChild(zrain);
    var fps, dup, x, y;
    dup = document.getElementById("rain").innerHTML;
    document.getElementById("rain").innerHTML = dup.repeat(2);
    fps = document.getElementById("rain").children;
    setInterval(function () {
        x = document.documentElement.clientWidth -1, y = document.documentElement.clientHeight - 100;
        for (var i=0; i < fps.length; i++) {
            fps[i].setAttribute("style", "position:absolute; height: 100px; width: 1px; left:" + Math.random() * x + "px;top:" + Math.random() * + y + "px;");
        }
    }, 1)
};

// Snow animation function
function makeItSnow () {
    if (weatherCondition === "Snow") {
        var snowing = document.createElement('i');
        snowing.classList.add('fas');
        snowing.classList.add('fa-snowflake');
        snowing.style.left = Math.random() * window.innerWidth + 'px';
        snowing.style.animationDuration = 4 + 's';
        document.body.appendChild(snowing);
} else {
    snowing = "";
}
};
