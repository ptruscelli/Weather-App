
import "./styles.css";

import { weatherAPI } from "./modules/weatherApi.js";
import { populateUI } from "./modules/ui.js";



const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const submitBtn = document.querySelector("#search-submit");


searchForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // stop html default page refresh upon submitting
    await submitHandler();
});



async function submitHandler() {

    if (searchInput.value === "") return; // do nothing for empty search bar

    submitBtn.disabled = true;

    try {

        const weatherData = await weatherAPI.callWeatherAPI(searchInput.value);

        console.log(weatherData.rawData);

        // console.log(weatherData.current);
        populateUI.populateCurrent(weatherData);

        console.log(weatherData.hourly);
        populateUI.populateHourly(weatherData);

        // console.log(weatherData.nextWeek);
        populateUI.populateDaily(weatherData);

    } catch (error) {
        console.error("Failed to fetch weather data: ", error);
    } finally {
        submitBtn.disabled = false;
    }

    searchInput.value = "";

};