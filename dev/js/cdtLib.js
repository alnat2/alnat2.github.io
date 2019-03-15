export function countdownOverSignal(snd) {
    snd.play();
}
export function secondsToTimeLeftString(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainderSeconds = seconds % 60;
    const timeLeft = `${minutes}:${remainderSeconds < 10 ? '0' : '' }${remainderSeconds}`;
    return timeLeft;
}
export function displayTimeLeft(seconds, displayElement) {
    let timeLeft = secondsToTimeLeftString(seconds);
    document.title = timeLeft;
    displayElement.textContent = timeLeft;
}
export function displayTotalTime(arr, displayElement) {
    if (arr.length === 1) {
        displayElement.textContent = '';
        return;
    }
    let total = arr.reduce((a, v) => {
        return parseInt(a) + parseInt(v);
    });
    displayElement.textContent = `total timers time is: ${total} ${total == 1 ? 'minute' : "minutes"}`;
}
export function displayPredefinedTimers(obj) {
    const {displayElement, container = 'select', elCls = 'display__time-predefined', arr } = obj;
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
export function displayNextTimers(obj) {
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
export function inputValidate(input, acceptReg) {
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
export function valuesToArray(str, limiter1 = '+', limiter2 = '*') {
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
                if (tempArr[0]) arr.push(tempArr[0]);
              mul --;
                   }
        } else {
            if (isNaN(splitedArr[i])) {
                arr = [];
                arr[0] = 'nan';
                return arr;
            }
            if (splitedArr[i]) arr.push(splitedArr[i]);
          }   
    }
    arr.reverse();
    return arr;
}
export function* counter(n = 1){
    var fn1 = n;
    while (true){
      var reset = yield fn1;
      fn1 --;
      if (reset){
          fn1 = reset + 1;
      }
    }
  }
export function initGenerator(gFunc) {
    const generator = gFunc();
    generator.next();
    return generator;
}