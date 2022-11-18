// global variables
var searchInput = document.getElementById(`search-input`);
var searchHistory = [];
var weatherData = [];
var apiKey = `c752613030f4ff0637fd1d7293501278`;
var searchButton = document.getElementById(`search-button`);

// function to add search input to local storage
function addtoHistory(event) {
    event.preventDefault();

    if (!searchInput) {
        console.log(`No search text found/entered!`);
        return;
    }

    searchHistory.push(searchInput);
    localStorage.setItem(`search-history`, JSON.stringify(searchHistory));
}

function getWeather(coordObj) {
    var { lat } = coordObj;
    var { lon } = coordObj;
    var URL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

    fetch(URL).then(function(res) {
        return res.json();
    }).then(function(data) {
        weatherData.push(data.current);
        console.log(weatherData);
    })
}

// grabs latitude and longitude for the 2nd fetch request
function getCoords(event) {
    event.preventDefault();

    if (!searchInput) {
        console.log(`No search text found/entered!`);
        return;
    }

    var searchTrim = searchInput.value.trim();

    var URL = `https://api.openweathermap.org/data/2.5/weather?q=${searchTrim}&limit=5&appid=${apiKey}`

    fetch(URL).then(function(res) {
        return res.json();
    }).then(function(data) {
        console.log(data.coord);
        getWeather(data.coord);
    })


}

// event listener for button
searchButton.addEventListener(`click`, (event) => {
    addtoHistory(event);
    getCoords(event);
})

