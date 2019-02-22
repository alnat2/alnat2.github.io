/*jshint esversion: 6 */
let countdown;
let secondsLeft;
let timers = [];
const timersPredefined = 
['15+5+15+9+15',
 '15*3',
 '15+10+15',
 '15+11+15+10+15+8+15'];
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
    const timeLeft = `${minutes}:${remainderSeconds < 10 ? '0' : '' }${remainderSeconds}`;
    return timeLeft;
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
// function inputValidate(input) {
//     let minutes, symbol;
//     minutes = input.value;
//     let unaccept = minutes.match(/[^\d\+\*\.]+/g);
//     if (unaccept !== null) {
//         displayArea.children[2].innerHTML = `${unaccept.join(' ')} ${symbol = unaccept.length == 1 ? 'unacceptable symbol' : 'unacceptable symbols'}`;
//         return;
//     }
//     input.value = '';
//     return minutes;
// }
function inputValidate(input, acceptReg) {
    let minutes = {};
    const re = new RegExp(acceptReg, 'g');
    let unaccept = input.match(re);
    if (unaccept !== null) {
        minutes.valid = false;
        minutes.unaccept = unaccept.join(' ');
        return minutes;
    }
    minutes.valid = true;
    minutes.data = input;
    return minutes;
}
function valuesToArray(str) {
    if (!str) return;
    str.split('+').forEach((i) => {
      if (i.includes('*')) {
        let tempArr = i.split('*');
        let mul = 1;
        if (tempArr.length >= 3) {
          for (let i = 1; i < tempArr.length; i++) {
            mul *= parseInt(tempArr[i]);
          }
        } else {
           mul = parseInt(tempArr[1]);
        }
        while (mul) {
               timers.push(tempArr[0]);
          mul --;
               }
      } else {
        timers.push(i);
      }
      })
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
        const validatedInput = inputValidate(timerInput.value, '[^\\d\+\\*\\.]+');
        let symbol;
        if (!validatedInput.valid) {
            displayArea.children[2].innerHTML = `${validatedInput.unaccept} ${symbol = validatedInput.unaccept.length == 1 ? 'unacceptable symbol' : 'unacceptable symbols'}`;
        return;
        }
        valuesToArray(validatedInput.data);
        if (timers === undefined || timers.length == 0) return;
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
        if (e.currentTarget === e.target && navigator.userAgent.indexOf("Firefox") != -1) return;
        valuesToArray(e.currentTarget.selectedOptions[0].innerHTML);
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