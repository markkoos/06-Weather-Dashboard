// global variables
var searchInput = document.getElementById(`search-input`);
var searchHistory = [];
var apiKey = `c752613030f4ff0637fd1d7293501278`;
var searchButton = document.getElementById(`search-button`);
var resetButton = document.getElementById(`clear-button`);
var ul = document.createElement(`ul`);
var cityCard = document.getElementById(`city-card`);
var futureCast = document.getElementById(`futurecast`);
var cardGroup = document.getElementById(`card-group`);
var cardDate = document.getElementById(`card-date`);

// --------------------------------------------------------------------------

// function to add search input to local storage
function addtoHistory(event) {
    event.preventDefault();

    if (!searchInput) {
        console.log(`No search text found/entered!`);
        return;
    }

    var searchData = searchInput.value.trim();

    searchHistory.push(searchData)

    console.log(searchHistory);
    
    // for loop to store each search in the local storage
    for (i = 0; i < searchHistory.length; i++) {
        localStorage.setItem(`search-history${i + 1}`, searchHistory[i]);
        var historyBtn = document.createElement(`button`);
        var history = document.getElementById(`history`);
        historyBtn.setAttribute(`type`, `button`);
        btnText = localStorage.getItem(`search-history${i + 1}`);
        historyBtn.textContent = btnText;
        history.append(historyBtn);
    }
}

// takes weather data and dynamically adds the data to the html page
function addData(data) {
    var searchData = searchInput.value.trim();
    var today = new Date();
    var day = today.getDate();
    var month = today.getMonth()+1;
    var year = today.getFullYear();

    var date = `(${month}/${day}/${year})`;

    // dynamically creates text for the city name
    var cityName = document.createElement(`h2`);
    cityName.setAttribute(`id`, `removeMe`)
    cityName.textContent = `${searchData} - ${date}`;

    // creating elements for weather data 
    var temp = document.createElement(`li`);
    var wind = document.createElement(`li`);
    var humidity  = document.createElement(`li`);
    var UVindex = document.createElement(`li`);

    temp.textContent = `Temp: ${data.current.temp} F`;
    wind.textContent = `Wind: ${data.current.wind_speed} MPH`;
    humidity.textContent = `Humidity: ${data.current.humidity} %`;

    // if statements to signifiy favorable, moderate, or severe UV index
    if (data.current.uvi < 2 ) {
        UVindex.textContent = `UV index: ${data.current.uvi}`;
        UVindex.style.color = `#00FF00`;
    } if (data.current.uvi >= 2 ) {
        UVindex.textContent = `UV index: ${data.current.uvi}`;
        UVindex.style.color = `#FFFF00`;
    } if (data.current.uvi > 2) {
        UVindex.textContent = `UV index: ${data.current.uvi}`;
        UVindex.style.color = `#FF0000`;
    }

    // appending elements for today's forecast
    cityCard.append(cityName)
    ul.setAttribute(`id`, `ME`);
    cityName.append(ul);
    ul.append(temp, wind, humidity, UVindex);

    // for-loop for 5-day forecast 
    for (i = 0; i < 5; i++) {
        // variables for each card
        var futTemp = document.createElement(`li`);
        var futWind = document.createElement(`li`);
        var futHum = document.createElement(`li`);
        var futUl = document.createElement(`ul`);
        var img = document.createElement(`img`);
        var div = document.createElement(`div`);
        var h5 = document.createElement(`h5`);
        var iconUrl = `https://openweathermap.org/img/w/${data.daily[i].weather[0].icon}.png`;
        var date = `(${month}/${day + i}/${year})`;

        // filling in data
        futTemp.textContent = `Temp: ${data.daily[i].temp} F`;
        futWind.textContent = `Wind: ${data.daily[i].wind_speed} MPH`;
        futHum.textContent = `Humidity: ${data.daily[i].humidity} %`;
        h5.textContent = date;
        img.setAttribute(`src`, iconUrl);
        div.setAttribute(`class`, `card bg-dark text-white deleter`);
        h5.setAttribute(`class`, `card-title`);

        // appending the elements for each card
        cardGroup.append(div);
        div.append(h5, img, futUl);
        futUl.append(futTemp, futWind, futHum);
    }
}


// grabs weather data after coords are found
function getWeather(coordObj) {
    var { lat } = coordObj;
    var { lon } = coordObj;
    var weatherData;
    var URL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

    fetch(URL).then(function(res) {
        return res.json();
    }).then(function(data) {
        weatherData = data;
        console.log(data);
        console.log(weatherData)
        addData(weatherData);
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

// shows hidden elements on html page
function show() {
    cityCard.style.display = `block`;
    futureCast.style.display = `block`;
}

// clears dynamically created elements (except buttons)
function clear() {
    cityNameRemove = document.getElementById(`ME`);
    cardToDelete = document.querySelector(`.deleter`);
    toBeDeletedLater = document.getElementById(`removeMe`)
    cardToDelete.remove();
    toBeDeletedLater.remove();
}

// event listener for button
searchButton.addEventListener(`click`, (event) => {
    show();
    addtoHistory(event);
    getCoords(event);
})

resetButton.addEventListener(`click`, () => {
    clear();
})