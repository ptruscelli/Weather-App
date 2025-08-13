
export const populateUI = (() => {



    function populateCurrent(weatherData) {

        const currentData = weatherData.current;

        const header = document.querySelector(".city-header");
        // const currentIcon = document.querySelector(".current-icon");
        const currentConditions = document.querySelector(".current-conditions");
        const currentTemp = document.querySelector(".current-temp span");
        const currentFeelsLike = document.querySelector(".current-feelsLike span");
        const currentPrecipProb = document.querySelector(".current-precipProb");
        const currentHumidity = document.querySelector(".current-humid span");
        const currentWindSpeed = document.querySelector(".current-wind span");
        const currentWindGust = document.querySelector(".current-windgust span");
        const currentSunrise = document.querySelector(".current-sunrise div:last-child");
        const currentSunset = document.querySelector(".current-sunset div:last-child");

        header.textContent = weatherData.rawData.address;
        currentConditions.textContent = currentData.conditions;
        currentTemp.textContent = currentData.temp;
        currentFeelsLike.textContent = currentData.feelslike;
        currentPrecipProb.textContent = currentData.precipprob;
        currentHumidity.textContent = currentData.humidity;
        currentWindSpeed.textContent = currentData.windspeed;
        currentWindGust.textContent = currentData.windgust;
        currentSunrise.textContent = currentData.sunrise;
        currentSunset.textContent = currentData.sunset;
    }



    function populateHourly(weatherData) {

        const hourlyData = weatherData.hourly;
        const hourlyScroll = document.querySelector(".hourly-scroll");

        hourlyScroll.innerHTML = "";

        hourlyData.forEach(hour => {
            const hourlyElement = createHourlyElement(hour);
            hourlyScroll.append(hourlyElement);
        });
    }



    function createHourlyElement(hourlyData) {

        const scrollItem = document.createElement("div");
        scrollItem.classList.add("scroll-item");

        scrollItem.innerHTML = `
            <div class="hourly-time hourly-item">${hourlyData.dateTime}</div>
            <div class="hourly-icon hourly-item"></div>
            <div class="hourly-temp hourly-item"><span>${hourlyData.temp}</span>&deg;</div>
            <div class="hourly-rain hourly-item"><span>${hourlyData.precipProb}</span>&percnt;</div>
            <div class="hourly-humi hourly-item"><span>${hourlyData.humidity}</span>&percnt;</div>
        `;

        return scrollItem;
    }



    function populateDaily(weatherData) {

        const dailyData = weatherData.nextWeek;
        const dailyScroll = document.querySelector(".daily-scroll");

        dailyScroll.innerHTML = "";

        dailyData.forEach(day => {
            const dailyElement = createDailyElement(day);
            dailyScroll.append(dailyElement);
        });
    }    



    function createDailyElement(day) {

        const scrollItem = document.createElement("div");
        scrollItem.classList.add("scroll-item");

        scrollItem.innerHTML = `
            <div class="daily-day daily-item">${day.weekDay}</div>
            <div class="daily-date daily-item">${day.dayDate}</div>
            <div class="daily-icon daily-item"></div>
            <div class="daily-temp daily-item"><span>min ${day.low}&deg;</span> ${day.temp}&deg; <span>max ${day.high}&deg;</span></div>
            <div class="daily-rain daily-item">${day.precipProb}&percnt;</div>
            <div class="daily-wind daily-item">${day.wind} km/h;</div>
        `;

        return scrollItem;        
    }

    return {
        populateCurrent,
        populateHourly,
        populateDaily
    }
})();

