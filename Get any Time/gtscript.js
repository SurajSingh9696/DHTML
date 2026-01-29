const timezones = ["UTC","America/New_York","America/Los_Angeles","America/Chicago","Europe/London","Europe/Paris","Europe/Tokyo","Asia/Kolkata","Asia/Bangkok","Australia/Sydney"];

const tzSelect = document.querySelector('#timezone-select');
const latInput = document.querySelector('#latitude');
const longInput = document.querySelector('#longitude');
const timeDisplay = document.querySelector('#time-display');
const modeBtns = document.querySelectorAll('.mode-btn');
const modeContents = document.querySelectorAll('.mode-content');
const tzBtn = document.querySelector('#timezone-btn');
const coordBtn = document.querySelector('#coordinates-btn');

let currentMode = 'timezone';

const populateTimezones = () => {
    tzSelect.innerHTML = '';
    timezones.forEach(tz => {
        const option = document.createElement('option');
        option.value = tz;
        option.textContent = tz;
        tzSelect.appendChild(option);
    });
};

const getTimeFromAPI = async (url) => {
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.datetime) {
            const time = new Date(data.datetime);
            const timeStr = time.toLocaleTimeString('en-US', { hour12: false });
            timeDisplay.textContent = timeStr;
        } else {
            timeDisplay.textContent = 'Invalid Response';
        }
    } catch (error) {
        timeDisplay.textContent = 'Error Fetching Time';
    }
};

const getTimeByTimezone = () => {
    const tz = tzSelect.value;
    const url = `https://timeapi.io/api/Time/current/zone?timeZone=${tz}`;
    getTimeFromAPI(url);
};

const getTimeByCoordinates = () => {
    const lat = latInput.value;
    const long = longInput.value;
    
    if (!lat || !long) {
        timeDisplay.textContent = 'Enter Coordinates';
        return;
    }
    
    const url = `https://timeapi.io/api/Time/current/coordinate?latitude=${lat}&longitude=${long}`;
    getTimeFromAPI(url);
};

modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        modeBtns.forEach(b => b.classList.remove('active'));
        modeContents.forEach(c => c.classList.remove('active'));
        
        btn.classList.add('active');
        currentMode = btn.getAttribute('data-mode');
        document.querySelector(`#${currentMode}-mode`).classList.add('active');
    });
});

tzBtn.addEventListener('click', getTimeByTimezone);
coordBtn.addEventListener('click', getTimeByCoordinates);

latInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') getTimeByCoordinates();
});

longInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') getTimeByCoordinates();
});

populateTimezones();