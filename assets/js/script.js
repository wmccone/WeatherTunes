//Weather APP Code

// Display current city in header of the Weather Element
// Display current weather condition in the text of the Weather Element






//Music APP Code
//Receive the weather condition into the Playlist function




//Background APP code
//Create a function that receives weather condition and adds a new background based off of that condition







//Form Code

//Submit listener
var submitBtn = document.querySelector(".btn-submit");
//input value is assigned a variable
var cityInput = document.querySelector("input");
var cityListEl = document.querySelector("#city-list");
var pastCityNames = [];

submitBtn.addEventListener("click", function(event){

    event.preventDefault();

    cityName = cityInput.value;

    if(cityName != ""){

        var newCityEl = document.createElement("button");
        newCityEl.textContent = cityName;

        var newLineEl = document.createElement("br")

        cityListEl.append(newCityEl);
        cityListEl.append(newLineEl);

    }

});


//Add variable to Local Storage

// Display local storage to list below form