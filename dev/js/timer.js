/*jshint esversion: 6 */
import { countdownOverSignal,
         displayTimeLeft,
         displayTotalTime,
         displayPredefinedTimers, 
         displayNextTimers, 
         inputValidate, 
         valuesToArray, 
         counter, 
         initGenerator } from './cdtLib.js';
let countdownRun;
let timers = [];
const timersPreset = 
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
const cdCounter = initGenerator(counter);
function timeOver() {
    countdownOverSignal(soundComplete);
    timers.pop();
    if (timers.length > 0) {
        timeStart(timers[timers.length - 1]);
    } else {
        timerStartPause('complete');
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
        let secondsLeft = cdCounter.next().value;
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
        timerStartPause(e, timers[timers.length - 1]);
        timerInput.value = '';
    } else {
        timerStartPause(e, null);
    }
}
function timerStartPause(e, dur) {
    if (e === 'complete' || e.target.textContent === '⏸') {
        timerRunButton.textContent = '▶';
        clearInterval(countdownRun);
    } else {
        if (dur === undefined) return;
        timeStart(dur);
        timerRunButton.textContent = '⏸';
    }
}

if (timersPreset.length > 3) {
    displayPredefinedTimers({
        arr: timersPreset, 
        displayElement: displayArea });
} else{
    displayPredefinedTimers({
        arr: timersPreset, 
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
    timerStartPause(e, timers[timers.length - 1]);
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
        timerStartPause(e, timers[timers.length - 1]);
    }
});
