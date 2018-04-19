/*jshint esversion: 6 */
let countdown;
let secondsLeft;
let timers = [];
const timersPredefined = 
['15+5+15+9+15', 
'15+15+15',
'15+10+15', 
'15+10+15+8+15+10+15'];
const nextTimers = document.getElementById('nextTimers');
const displayArea = document.getElementById('displayArea');
const timerInput = document.getElementById('timerInput');
const timerRunButton = document.getElementById('timerRun');
const timerDisplay = document.querySelector('.displayTimeLeft');
const timerTotalTime = document.querySelector('.displayTimeTotal');
const soundComplete = document.getElementById('complete');

function countdownOver() {
    soundComplete.play();
}
function secondsToTimeLeftString(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainderSeconds = seconds % 60;
    const display = `${minutes}:${remainderSeconds < 10 ? '0' : '' }${remainderSeconds}`;
    return display;
}
function displayTimeLeft(seconds) {
    let timeLeft = secondsToTimeLeftString(seconds);
    document.title = timeLeft;
    timerDisplay.textContent = timeLeft;
}
function displayTotalTime(arr) {
    if (arr.length == 1) {
        timerTotalTime.textContent = '';
        return;
    }
    let total = arr.reduce((a, v) => {
        return parseInt(a) + parseInt(v);
    });
    timerTotalTime.textContent = `total timers time is: ${total} ${total == 1 ? 'minute' : "minutes"}`;
}
function displayTimersPredefined(arr) {
    const insertArea = document.createDocumentFragment();
    for (let i = 0; i < arr.length; i++) {
        const insertElement = document.createElement('button');
        insertElement.className = "display__time-predefined";
        insertElement.innerHTML = arr[i];
        insertArea.appendChild(insertElement);
    }
    displayArea.appendChild(insertArea);
}
function displayTimersPredefinedSelect(arr) {
    const insertArea = document.createDocumentFragment();
    const insertSelect = document.createElement('select');
    insertSelect.setAttribute('id', 'predefinedSelect');
    for (let i = 0; i < arr.length; i++) {
        const insertElement = document.createElement('option');
        insertElement.className = "display__time-predefined";
        insertElement.innerHTML = arr[i];
        insertSelect.appendChild(insertElement);
    }
    insertArea.appendChild(insertSelect);
    displayArea.appendChild(insertArea);
}
function displayNextTimers() {
    if (nextTimers.hasChildNodes()) {
        nextTimers.innerHTML = '';
    }
    if (timers.length == 1) {
        const insertCurrentElement = document.createElement("li");
        insertCurrentElement.className = "nextTimers__item";
        insertCurrentElement.innerHTML = 'No more timers';
        nextTimers.appendChild(insertCurrentElement);
    } else {
        const insertArea = document.createDocumentFragment();
        for (let i = timers.length - 2; i >= 0; i--) {
            const insertCurrentElement = document.createElement("li");
            const startBtn = document.createElement('button');
            startBtn.className = "startBtn";
            startBtn.setAttribute("data-arrPos", (i + 1) - timers.length);
            startBtn.innerHTML = timers[i];
            const deleteBtn = document.createElement('button');
            deleteBtn.className = "deleteBtn";
            deleteBtn.setAttribute("data-arrPos", i - timers.length);
            deleteBtn.innerHTML = "delete";
            insertCurrentElement.className = "nextTimers__item";
            insertCurrentElement.appendChild(startBtn);
            insertCurrentElement.appendChild(deleteBtn);
            insertArea.appendChild(insertCurrentElement);
        }
        nextTimers.appendChild(insertArea);
    }
}
function valuesToArray(timerSet) {
    let minutes;
    if (timerSet.value) {
        minutes = timerSet.value;
        timerSet.value = '';
    } else {
        minutes = timerSet;
    }
    timers = minutes.split('+');
    timers.reverse();
}
function timer(seconds) {
    clearInterval(countdown);
    displayNextTimers();
    displayTotalTime(timers);
    const now = Date.now();
    const then = now + seconds * 1000;
    displayTimeLeft(seconds);
    countdown = setInterval(() => {
        secondsLeft = Math.round((then - Date.now()) / 1000);
        if (secondsLeft < 0) {
            countdownOver();
            timers.pop();
            clearInterval(countdown);
            if (timers.length > 0) {
                timer(timers[timers.length - 1] * 60);
            } else {
                timerRunButton.textContent = '▶';
            }
            return;
        }
        displayTimeLeft(secondsLeft);
    }, 1000);
}
function timerStart(duration) {
    timer(duration);
    timerRunButton.textContent = '⏸';
}
function timersRun() {
    if (timerInput.value) {
        valuesToArray(timerInput);
        timerStart(timers[timers.length - 1] * 60);
    } else {
        timerPauseResume();
    }
}
function timerPauseResume() {
    if (!countdown) return;
    if (timerRunButton.textContent === '⏸') {
        timerRunButton.textContent = '▶';
        clearInterval(countdown);
    } else {
        timerStart(secondsLeft);
    }
}

if (timersPredefined.length > 3) {
    displayTimersPredefinedSelect(timersPredefined);
    const predefinedSelect = document.getElementById('predefinedSelect');
    predefinedSelect.addEventListener('click', e => {
        valuesToArray(e.target.selectedOptions[0].innerHTML);
        timerStart(timers[timers.length - 1] * 60);
    });
} else{
    displayTimersPredefined(timersPredefined);
    displayArea.addEventListener('click', e => {
        if (e.target.tagName === 'BUTTON') {
            valuesToArray(e.target.innerHTML);
            timerStart(timers[timers.length - 1] * 60);
        }
    });
}

timerRunButton.addEventListener('click', timersRun);

timerInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        timersRun();
    }
});
nextTimers.addEventListener('click', e => {
    const pos = e.target.dataset.arrpos;
    if (e.target.className === 'deleteBtn') {
        timers.splice(pos, 1);
        displayNextTimers();
        displayTotalTime(timers);
    } else if (e.target.className === 'startBtn') {
        timers.splice(pos);
        timers.reverse();
        let newTimers = timers.join('+');
        valuesToArray(newTimers);
        timerStart(timers[timers.length - 1] * 60);
    }
});