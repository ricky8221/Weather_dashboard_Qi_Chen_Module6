var key = "767baab1ba615005b7b57e268ed513fe"
const cityInput = $('#city-input');
var test = document.getElementById(test)
let pastCities = [];

// selector for HTML elements to display 
const cityEl = $('h2#city');
const dateEl = $('h3#date');
const weatherIconEl = $('img#weather-icon');
const temperatureEl = $('span#temperature');
const humidityEl = $('span#humidity');
const windEl = $('span#wind');
const uvIndexEl = $('span#uv-index');
const cityListEl = $('div.cityList');

// store city name, lat and lon into local storage
function storeCitiLocation() {
    localStorage.setItem('pastCities', JSON.stringify(pastCities));
}


// search the city name to get the city Lat&Lon
$('#searchForm').on('submit', function (event) {

    event.preventDefault();
    // get city name 
    let city = cityInput.val().trim();;
    // clear input field
    cityInput.val('');
    var LocationURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`
    fetch(LocationURL)
    .then(function(response){

        return response.json();
    
    })
    .then(function (data) {

        var lon = data.coord.lon
        var lat = data.coord.lat
        pastCities.unshift({city, lon, lat})
        var cityInfo = JSON.parse(localStorage.getItem("pastCities"))
        storeCitiLocation()
        // search weather using Lat&Lon in localstorage 
        searchWeather();

    });

    displayCities(pastCities);

})

function searchWeather(){

    if (pastCities != null){
    var cityInfo = JSON.parse(localStorage.getItem("pastCities"))
    var lat = cityInfo[0].lat;
    var lon = cityInfo[0].lon;
    var city = cityInfo[0].city.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
    var weatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=767baab1ba615005b7b57e268ed513fe`
    cityEl.text(city);
    }

    $.ajax({
        url: weatherUrl,
        method: 'GET'
        })
        .then(function (response) {

            // display the current weather info in DOM
            let uvIndex = response.current.uvi;
            let uvColor = setUVIndexColor(uvIndex);
            uvIndexEl.text(response.current.uvi);
            uvIndexEl.attr('style', `background-color: ${uvColor}; color: ${uvColor === "yellow" ? "black" : "white"}`);
            temperatureEl.text(((response.current.temp- 273.15) * 1.8 + 32).toFixed(1))
            humidityEl.text(response.current.humidity);
            windEl.text((response.current.wind_speed * 2.237).toFixed(1));        
            let fiveDay = response.daily;
            let formattedDate = moment.unix(response.current.dt).format('L');
            dateEl.text(formattedDate);
            var weatherIcon = response.current.weather[0].icon
            weatherIconEl.attr('src', `http://openweathermap.org/img/wn/${weatherIcon}.png`);

            // Display 5 days forecast on DOM
            for (let i = 0; i <= 5; i++) {
                let currDay = fiveDay[i];
                $(`div.day-${i} .card-title`).text(moment.unix(currDay.dt).format('L'));
                $(`div.day-${i} .fiveDay-img`).attr(
                    'src',
                    `http://openweathermap.org/img/wn/${currDay.weather[0].icon}.png`
                ).attr('alt', currDay.weather[0].description);
                $(`div.day-${i} .fiveDay-temp`).text(((currDay.temp.day - 273.15) * 1.8 + 32).toFixed(1));
                $(`div.day-${i} .fiveDay-humid`).text(currDay.humidity);
        }
        
    })
}

// Function to color the UV Index 
function setUVIndexColor(uvi) {
    if (uvi < 3) {
        return 'green';
    } else if (uvi >= 3 && uvi < 6) {
        return 'yellow';
    } else if (uvi >= 6 && uvi < 8) {
        return 'orange';
    } else if (uvi >= 8 && uvi < 11) {
        return 'red';
    } else return 'purple';
}
function displayCities(pastCities) {
    cityListEl.empty();
    var cityInfo = JSON.parse(localStorage.getItem("pastCities"))
    pastCities.splice(5);
    var storedCities = [...pastCities]

    storedCities.forEach(function(cityName){

        let cityDiv = $('<div>').addClass('col-12 city');
        let cityBtn = $('<button>').addClass('btn btn-light city-btn').text(cityName.city);
        cityDiv.append(cityBtn);
        cityListEl.append(cityDiv);

    })

    }


displayCities(pastCities);

$(document).on("click", "button.city-btn", function (event) {
    let clickedCity = $(this).text();
    var LocationURL = `https://api.openweathermap.org/data/2.5/weather?q=${clickedCity}&appid=${key}`
    var city = $(this).text().toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
    fetch(LocationURL)
    .then(function(response){
        
        return response.json();
    
    })
    .then(function (data) {

        var lon = data.coord.lon
        var lat = data.coord.lat
        pastCities.unshift({city, lon, lat})
        var cityInfo = JSON.parse(localStorage.getItem("pastCities"))
        storeCitiLocation()
        // search weather using Lat&Lon in localstorage 
        searchWeather();

    });
    

});

var text = "foo bar loo zoo moo";
text = text.toLowerCase()
    .split(' ')
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(' ');