const strips = [...document.querySelectorAll(".strip")];
const background = document.querySelector(".background");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");

const numberSize = 8;
let timeOffset = 0; // Default to local time

function highlight(strip, digit) {
    const numberElement = strips[strip].querySelector(`.number:nth-of-type(${digit + 1})`);
    if (numberElement) {
        numberElement.classList.add("pop");
        setTimeout(() => {
            numberElement.classList.remove("pop");
        }, 950);
    }
}

function stripSlider(strip, number) {
    const d1 = Math.floor(number / 10);
    const d2 = number % 10;

    strips[strip].style.transform = `translateY(${-(d1 * numberSize)}vmin)`;
    strips[strip + 1].style.transform = `translateY(${-(d2 * numberSize)}vmin)`;

    highlight(strip, d1);
    highlight(strip + 1, d2);
}

async function fetchTime(location) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=YOUR_API_KEY`);
    const data = await response.json();
    const { lat, lon } = data.coord;

    const timezoneRes = await fetch(`https://api.timezonedb.com/v2.1/get-time-zone?key=YOUR_API_KEY&format=json&by=position&lat=${lat}&lng=${lon}`);
    const timezoneData = await timezoneRes.json();

    timeOffset = timezoneData.gmtOffset / 3600;
    updateBackground(location);
}

function updateBackground(location) {
    background.style.backgroundImage = `url(https://source.unsplash.com/1600x900/?${location})`;
}

searchBtn.addEventListener("click", () => {
    const location = searchInput.value.trim();
    if (location) fetchTime(location);
});

setInterval(() => {
    const time = new Date(new Date().getTime() + timeOffset * 3600 * 1000);

    const hours = time.getUTCHours();
    const mins = time.getUTCMinutes();
    const secs = time.getUTCSeconds();

    stripSlider(0, hours);
    stripSlider(2, mins);
    stripSlider(4, secs);
}, 1000);
