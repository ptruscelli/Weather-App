import "./styles.css";

import { format } from "date-fns";
import { enGB } from "date-fns/locale";


async function callWeatherAPI(city) {

    const link = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}/next7days?unitGroup=metric&elements=datetime%2CdatetimeEpoch%2Cname%2Caddress%2CresolvedAddress%2Ctempmax%2Ctempmin%2Ctemp%2Cfeelslike%2Chumidity%2Cprecip%2Cprecipprob%2Cpreciptype%2Cwindgust%2Cwindspeed%2Cwindspeedmean%2Cwinddir%2Ccloudcover%2Csunrise%2Csunset%2Cconditions%2Cdescription%2Cicon&include=days%2Ccurrent%2Chours&key=TRLMYRRSPTZTW27C69VKJ5E43&contentType=json`;

    try {

        const response = await fetch(link, {mode: 'cors'});
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // console.log(data);

        const currentWeather = processCurrentConditions(data);
        console.log(`Parsed current weather:`, currentWeather);

        const hourlyWeather = processHourlyConditions(data);
        console.log("hourly weather:", hourlyWeather);

        const nextWeekWeather = processNextWeekConditions(data);


        return { rawData: data, current: currentWeather, hourly: hourlyWeather, nextWeek: nextWeekWeather}; 

    } catch (error) {
        console.log(error);
    }
};

callWeatherAPI("london");



function processCurrentConditions(data) {

    if (!data.currentConditions) {
        // check that currentConditions exists
        throw new Error("current weather data not available");
    }

    const {
        temp,
        feelslike,
        humidity,
        precip,
        precipprob,
        windspeed,
        winddir,
        conditions
    } = data.currentConditions;

    return {
        temp,
        feelslike,
        humidity,
        precip,
        precipprob,
        windspeed,
        winddir,
        conditions
    };
};



function processNextWeekConditions(data) {

    if (!data.days || !Array.isArray(data.days)) {
        // checks that data.days exists, is truthy, and is actually an array
        throw new Error("daily weather data not available");
    }

    return data.days.map(day => ({
        dateTime: day.datetimeEpoch,
        temp: day.temp,
        high: day.tempmax,
        low: day.tempmin,
        precipProb: day.precipprob,
        wind: day.windspeedmean,
        windGusts: day.windgust,
        cloudCover: day.cloudcover,
        icon: day.icon,
    }));
}


function processHourlyConditions(data) {
    // function to get weather data for the next 24 hours 
    // can't just loop over next 24 hours because the hours will be split over different days/arrays

    const now = Date.now() / 1000; // match api datetimeEpoch format which is in seconds

    const fromNow = now + (24 * 60 * 60); // 24 hours from now


    const hourlyData = [];
    
    // iterate through days and collect next 24 hours
    for (const day of data.days) {

        if (!day.hours || !Array.isArray(day.hours)) {
            // checks that day.hours exists, is truthy, and is actually an array
            throw new Error(`hourly weather data not available for day: ${day.datetime || "unknown day"}`);
        };

        for (const hour of day.hours) {
            if (hour.datetimeEpoch >= now && hour.datetimeEpoch <= fromNow) {

                hourlyData.push({
                    APITime: hour.datetimeEpoch,
                    dateTime: format(hour.datetimeEpoch*1000, 'dd/MM/yyyy HH:mm', { locale: enGB }),
                    temp: hour.temp,
                    feelsLike: hour.feelslike,
                    humidity: hour.humidity,
                    precipProb: hour.precipprob,
                    wind: hour.windspeed,
                    windGust: hour.windgust,
                    windDir: hour.winddir,
                    icon: hour.icon
                });
            };

            if (hourlyData.length >= 24) break; // early exit out of loops once we have 24 hours of data
        };

        if (hourlyData.length >= 24) break;
    };

    return hourlyData;
};
