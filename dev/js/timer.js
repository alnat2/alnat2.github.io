/*jshint esversion: 6 */
let countdown;
let countdownRun;
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

function countdownOver(snd) {
    snd.play();
}
function secondsToTimeLeftString(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainderSeconds = seconds % 60;
    const timeLeft = `${minutes}:${remainderSeconds < 10 ? '0' : '' }${remainderSeconds}`;
    return timeLeft;
}
function displayTimeLeft(seconds, displayElement) {
    let timeLeft = secondsToTimeLeftString(seconds);
    document.title = timeLeft;
    displayElement.textContent = timeLeft;
}
function displayTotalTime(arr, displayElement) {
    if (arr.length == 1) {
        displayElement.textContent = '';
        return;
    }
    let total = arr.reduce((a, v) => {
        return parseInt(a) + parseInt(v);
    });
    displayElement.textContent = `total timers time is: ${total} ${total == 1 ? 'minute' : "minutes"}`;
}
function displayPredefinedTimers(obj) {
    const {displayElement, container= 'select', elCls = 'display__time-predefined', arr } = obj;
    const insertContainer = document.createElement(container);
    const el = container === 'select' ? 'option' : 'button';
    insertContainer.setAttribute('id', 'predefinedContainer');
    for (let i = 0; i < arr.length; i++) {
        const insertElement = document.createElement(el);
        Object.assign(insertElement, {
            className: elCls,
            innerHTML: arr[i]
           })
        insertContainer.appendChild(insertElement);
    }
    displayElement.appendChild(insertContainer);
}
function displayNextTimers(obj) {
    const {displayElement, elCls = 'nextTimers__item', arr } = obj;
    if (displayElement.hasChildNodes()) {
        displayElement.innerHTML = '';
    }
    const insertArea = document.createElement('ul');
    if (arr.length == 1) {
        const insertCurrentElement = document.createElement('li');
        Object.assign(insertCurrentElement, {
            className: elCls,
            innerHTML: 'No more timers'
           })
        insertArea.appendChild(insertCurrentElement);
    } else {
        for (let i = arr.length - 2; i >= 0; i--) {
            const insertCurrentElement = document.createElement('li');
            insertCurrentElement.className = elCls;
            const startBtn = document.createElement('button');
            Object.assign(startBtn, {
                className: 'startBtn',
                innerHTML: arr[i]
               })
            startBtn.setAttribute("data-arrPos", (i + 1) - arr.length);
            const deleteBtn = document.createElement('button');
            Object.assign(deleteBtn, {
                className: 'deleteBtn',
                innerHTML: 'delete'
               })
            deleteBtn.setAttribute("data-arrPos", i - arr.length);          
            insertCurrentElement.appendChild(startBtn);
            insertCurrentElement.appendChild(deleteBtn);
            insertArea.appendChild(insertCurrentElement);
        }
    }
    displayElement.appendChild(insertArea);
}
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
function valuesToArray(str, limiter1 = '+', limiter2 = '*') {
    if (!str) return;
    let arr = [];
    const splitedArr = str.split(limiter1);
    for (let i = 0; i < splitedArr.length; i++) {
        if (splitedArr[i].includes(limiter2)) {
            let tempArr = splitedArr[i].split(limiter2);
            let mul = 1;
            if (tempArr.length >= 3) {
              for (let i = 1; i < tempArr.length; i++) {
                mul *= parseInt(tempArr[i]);
              }
            } else {
               mul = parseInt(tempArr[1]);
            }
            while (mul) {
                if (isNaN(tempArr[0])) {
                    arr = [];
                    arr[0] = 'nan';
                    return arr;
                }
                arr.push(tempArr[0]);
              mul --;
                   }
        } else {
            if (isNaN(splitedArr[i])) {
                arr = [];
                arr[0] = 'nan';
                return arr;
            }
            arr.push(splitedArr[i]);
          }   
    }
    arr.reverse();
    return arr;
}
function* counter(n = 1){
    var fn1 = n;
    while (true){
      var reset = yield fn1;
      fn1 --;
      if (reset){
          fn1 = reset + 1;
      }
    }
  }
function initGenerator(gFunc) {
    const generator = gFunc();
    generator.next();
    return generator;
}
const cdCounter = initGenerator(counter);

function timeOver() {
    countdownOver(soundComplete);
    timers.pop();
    if (timers.length > 0) {
        timeStart(timers[timers.length - 1]);
    } else {
        timerRunButton.textContent = '▶';
    }
}
function timeStart(min) {
    let sec = min * 60;
    clearInterval(countdownRun);
    displayNextTimers({
        arr: timers, 
        displayElement: nextTimers });
    displayTotalTime(timers, timerTotalTime);
    if (min) {
        cdCounter.next(sec);
        displayTimeLeft(sec, timerDisplay);
    } 
    countdownRun = setInterval(() => {
        secondsLeft = cdCounter.next().value;
        displayTimeLeft(secondsLeft, timerDisplay);
        if (secondsLeft <= 0) {
          clearInterval(countdownRun);
          timeOver();
            }
      }, 1000)
}



function timersRun(e) {
    if (timerInput.value) {
        const validatedInput = inputValidate(timerInput.value, '[^\\d\+\\*\\.]+');
        let symbol;
        if (!validatedInput.valid) {
            displayArea.children[2].innerHTML = `${validatedInput.unaccept} ${symbol = validatedInput.unaccept.length == 1 ? 'unacceptable symbol' : 'unacceptable symbols'}`;
            return;
        }
        timers = valuesToArray(validatedInput.data);
        if (timers[0] === 'nan') {
            displayArea.children[2].innerHTML = 'incorrect sequence';
            return;
        }
        timerStartPause1(e, timers[timers.length - 1]);
        timerInput.value = '';
    } else {
        timerStartPause1(e, null);
    }
}

function timerStartPause1(e, dur) {
    if (e.target.textContent === '⏸') {
        timerRunButton.textContent = '▶';
        clearInterval(countdownRun);
    } else {
        if (dur === undefined) return;
        timeStart(dur);
        timerRunButton.textContent = '⏸';
    }
}

if (timersPredefined.length > 3) {
    displayPredefinedTimers({
        arr: timersPredefined, 
        displayElement: displayArea });
} else{
    displayPredefinedTimers({
        arr: timersPredefined, 
        container: 'div', 
        displayElement: displayArea });
}
const predefinedContainer = document.getElementById('predefinedContainer');
predefinedContainer.addEventListener('click', e => {
    if (e.target.tagName === 'BUTTON') {
        timers = valuesToArray(e.target.innerHTML);
    } else {
        if (e.currentTarget === e.target && navigator.userAgent.indexOf("Firefox") != -1) return;
        timers = valuesToArray(e.currentTarget.selectedOptions[0].innerHTML);
    }
    timerStartPause1(e, timers[timers.length - 1]);
});
timerRunButton.addEventListener('click', e => timersRun(e));
timerInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
        e.preventDefault();
        timersRun(e);
    }
});
nextTimers.addEventListener('click', e => {
    const pos = e.target.dataset.arrpos;
    if (e.target.className === 'deleteBtn') {
        timers.splice(pos, 1);
        displayNextTimers({
            arr: timers,
            displayElement: nextTimers });
        displayTotalTime(timers, timerTotalTime);
    } else if (e.target.className === 'startBtn') {
        timers.splice(pos);
        timerStartPause1(e, timers[timers.length - 1]);
    }
});