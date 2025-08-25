import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export const weatherAPI = (() => {

    async function callWeatherAPI(city) {

        const link = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}/next7days?unitGroup=metric&elements=datetime,datetimeEpoch,name,address,resolvedAddress,latitude,longitude,tempmax,tempmin,temp,feelslike,humidity,precipprob,windgust,windspeed,windspeedmean,winddir,cloudcover,sunrise,sunset,conditions,description,icon&include=days,events,current,hours,alerts&key=TRLMYRRSPTZTW27C69VKJ5E43&contentType=json`;

        try {

            const response = await fetch(link, {mode: 'cors'});
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            const currentWeather = processCurrentConditions(data);

            const hourlyWeather = processHourlyConditions(data);

            const nextWeekWeather = processNextWeekConditions(data);


            return { rawData: data, current: currentWeather, hourly: hourlyWeather, nextWeek: nextWeekWeather}; 

        } catch (error) {
            console.error("Error in API Data processing:", error);
            throw error;
        };
    };



    function processCurrentConditions(data) {

        if (!data.currentConditions) {
            // check that currentConditions exists
            throw new Error("current weather data not available");
        }

        const {
            datetime,
            datetimeEpoch,
            temp,
            feelslike,
            humidity,
            precipprob,
            windspeed,
            winddir,
            windgust,
            conditions,
            icon,
            sunrise,
            sunset
        } = data.currentConditions;

        return {
            datetime,
            datetimeEpoch,
            temp,
            feelslike,
            humidity,
            precipprob,
            windspeed,
            winddir,
            windgust,
            conditions,
            icon,
            sunrise,
            sunset
        };
    };



    function processNextWeekConditions(data) {

        if (!data.days || !Array.isArray(data.days)) {
            // checks that data.days exists, is truthy, and is actually an array
            throw new Error("daily weather data not available");
        }



        return data.days.map(day => ({
            dateTime: day.datetimeEpoch,
            weekDay: format((day.datetimeEpoch * 1000), 'EEE'), // *1000 to convert from unix epoch seconds to js milliseconds
            dayDate: format((day.datetimeEpoch * 1000), 'd MMM'),
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


        const now = (Date.now() / 1000); // match api datetimeEpoch format which is in seconds
        const fromNow = now + (24 * 3600); // 24 hours from now

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
                        dateTime: format(toZonedTime(new Date(hour.datetimeEpoch * 1000), data.timezone), 'EEE HH:mm'), 
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



    // function getDateWithUTCOffset(tzOffset) {
    //     const now = new Date(); // get current time
    //     const currentOffset = -now.getTimezoneOffset() / 60; // current local tz offset in hours

    //     const deltaOffset = tzOffset - currentOffset; // timezone difference
    //     const deltaOffsetMilli = deltaOffset * 1000 * 3600; // tz difference in ms

    //     const nowTimestamp = now.getTime(); // milliseconds since unix
        
    //     return new Date(nowTimestamp + deltaOffsetMilli); // new date object with tz offset applied
    // };



    return {
        callWeatherAPI
    }

})();