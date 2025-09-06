

export const populateUI = (() => {


    function populateCurrent(weatherData) {

        const currentData = weatherData.current;

        const header = document.querySelector(".city-header");
        const currentIcon = document.querySelector(".current-svg");
        const currentConditions = document.querySelector(".current-conditions");
        const currentTemp = document.querySelector(".current-temp span");
        const currentPrecipProb = document.querySelector(".current-precipProb");
        const currentHumidity = document.querySelector(".current-humid span");
        const currentWindSpeed = document.querySelector(".current-wind span");
        const currentWindGust = document.querySelector(".current-windgust span");
        const currentSunrise = document.querySelector(".current-sunrise .info-container div:last-child");
        const currentSunset = document.querySelector(".current-sunset .info-container div:last-child");

        loadRawSvg(currentData.icon, currentIcon);

        header.textContent = weatherData.rawData.resolvedAddress;
        currentConditions.textContent = currentData.conditions;
        currentTemp.textContent = currentData.temp;
        currentPrecipProb.textContent = currentData.precipprob;
        currentHumidity.textContent = currentData.humidity;
        currentWindSpeed.textContent = currentData.windspeed;
        currentWindGust.textContent = currentData.windgust;
        currentSunrise.textContent = currentData.sunrise;
        currentSunset.textContent = currentData.sunset;

        resetScroll();
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

        const precipColor = hourlyData.precipProb >= 20 ? "blue" : "grey" ;

        scrollItem.innerHTML = `
            <div class="hourly-time hourly-item">${hourlyData.dateTime}</div>
            <div class="hourly-icon hourly-item"></div>
            <div class="hourly-temp hourly-item"><span>${hourlyData.temp}</span>&deg;</div>
            <div class="hourly-rain hourly-item ${precipColor}">${rainSVG}<span>${hourlyData.precipProb}&percnt;</span></div>
        `;

        const hourlyIconDiv = scrollItem.querySelector(".hourly-icon");
        // loadRawSvg(hourlyData.icon, hourlyIcon);

        const icon = document.createElement("img");
        const iconUrl = new URL(`../icons/${hourlyData.icon}.svg`, import.meta.url).href;

        icon.src = iconUrl
        icon.alt = hourlyData.icon; // accessibility

        hourlyIconDiv.appendChild(icon);

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
            <div class="daily-temp daily-item">${day.temp}&deg;</div>
            <div class="daily-minmax daily-item">${day.low}&deg; / ${day.high}&deg;</div>
        `;

        const dailyIconDiv = scrollItem.querySelector(".daily-icon");

        const icon = document.createElement("img");
        const iconUrl = new URL(`../icons/${day.icon}.svg`, import.meta.url).href;

        icon.src = iconUrl
        icon.alt = day.icon; // accessibility

        dailyIconDiv.appendChild(icon);

        return scrollItem;        
    };


    async function loadRawSvg(iconName, parentElement) {
        console.log(`attempting to grab: ${iconName}`);

        try {
            const { default: svg } = await import(`../icons/${iconName}.svg?raw`);

            console.log(`successfuly loaded ${iconName}`);
            parentElement.innerHTML = svg;
        } catch (error) {
            console.error(`Failed to load icon: ${iconName}.svg`, error);
            console.log('Icon path attempted:', `../icons/${iconName}.svg`);
        }

    };

    

    function resetScroll() {
        // function for resetting horizontal scroll bars 
        // when new data populates ui

        const hourlyScroll = document.querySelector('.hourly-scroll');
        const dailyScroll = document.querySelector('.daily-scroll');

        if (hourlyScroll) {
            hourlyScroll.scrollLeft = 0;
        }
        
        if (dailyScroll) {
            dailyScroll.scrollLeft = 0;
        }
    }
    

    const rainSVG = `<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 18.5L15 21M8 18.5L7 21M12 18.5L11 21M7 15C4.23858 15 2 12.7614 2 10C2 7.23858 4.23858 5 7 5C7.03315 5 7.06622 5.00032 7.09922 5.00097C8.0094 3.2196 9.86227 2 12 2C14.5192 2 16.6429 3.69375 17.2943 6.00462C17.3625 6.00155 17.4311 6 17.5 6C19.9853 6 22 8.01472 22 10.5C22 12.9853 19.9853 15 17.5 15C13.7434 15 11.2352 15 7 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>`;


    return {
        populateCurrent,
        populateHourly,
        populateDaily
    }
})();

