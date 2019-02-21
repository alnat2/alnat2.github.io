var countdown;
var secondsLeft;
var timers = [];
var timersPredefined = [
  "15+5+15+9+15",
  "15*3",
  "15+10+15",
  "15+11+15+10+15+8+15"
];
var nextTimers = document.getElementById("nextTimers");
var displayArea = document.getElementById("displayArea");
var timerInput = document.getElementById("timerInput");
var timerRunButton = document.getElementById("timerRun");
var timerDisplay = document.querySelector(".displayTimeLeft");
var timerTotalTime = document.querySelector(".displayTimeTotal");
var soundComplete = document.getElementById("complete");

function countdownOver() {
  soundComplete.play();
}

function secondsToTimeLeftString(seconds) {
  var minutes = Math.floor(seconds / 60);
  var remainderSeconds = seconds % 60;
  var display = ""
    .concat(minutes, ":")
    .concat(remainderSeconds < 10 ? "0" : "")
    .concat(remainderSeconds);
  return display;
}

function displayTimeLeft(seconds) {
  var timeLeft = secondsToTimeLeftString(seconds);
  document.title = timeLeft;
  timerDisplay.textContent = timeLeft;
}

function displayTotalTime(arr) {
  if (arr.length == 1) {
    timerTotalTime.textContent = "";
    return;
  }

  var total = arr.reduce(function(a, v) {
    return parseInt(a) + parseInt(v);
  });
  timerTotalTime.textContent = "total timers time is: "
    .concat(total, " ")
    .concat(total == 1 ? "minute" : "minutes");
}

function displayTimersPredefined(arr) {
  var insertArea = document.createDocumentFragment();

  for (var i = 0; i < arr.length; i++) {
    var insertElement = document.createElement("button");
    insertElement.className = "display__time-predefined";
    insertElement.innerHTML = arr[i];
    insertArea.appendChild(insertElement);
  }

  displayArea.appendChild(insertArea);
}

function displayTimersPredefinedSelect(arr) {
  var insertArea = document.createDocumentFragment();
  var insertSelect = document.createElement("select");
  insertSelect.setAttribute("id", "predefinedSelect");

  for (var i = 0; i < arr.length; i++) {
    var insertElement = document.createElement("option");
    insertElement.className = "display__time-predefined";
    insertElement.innerHTML = arr[i];
    insertSelect.appendChild(insertElement);
  }

  insertArea.appendChild(insertSelect);
  displayArea.appendChild(insertArea);
}

function displayNextTimers() {
  if (nextTimers.hasChildNodes()) {
    nextTimers.innerHTML = "";
  }

  if (timers.length == 1) {
    var insertCurrentElement = document.createElement("li");
    insertCurrentElement.className = "nextTimers__item";
    insertCurrentElement.innerHTML = "No more timers";
    nextTimers.appendChild(insertCurrentElement);
  } else {
    var insertArea = document.createDocumentFragment();

    for (var i = timers.length - 2; i >= 0; i--) {
      var _insertCurrentElement = document.createElement("li");

      var startBtn = document.createElement("button");
      startBtn.className = "startBtn";
      startBtn.setAttribute("data-arrPos", i + 1 - timers.length);
      startBtn.innerHTML = timers[i];
      var deleteBtn = document.createElement("button");
      deleteBtn.className = "deleteBtn";
      deleteBtn.setAttribute("data-arrPos", i - timers.length);
      deleteBtn.innerHTML = "delete";
      _insertCurrentElement.className = "nextTimers__item";

      _insertCurrentElement.appendChild(startBtn);

      _insertCurrentElement.appendChild(deleteBtn);

      insertArea.appendChild(_insertCurrentElement);
    }

    nextTimers.appendChild(insertArea);
  }
}

function inputValidate(input) {
  var minutes, symbol;
  minutes = input.value;
  var unaccept = minutes.match(/[^\d\+\*\.]+/g);

  if (unaccept !== null) {
    displayArea.children[2].innerHTML = ""
      .concat(unaccept.join(" "), " ")
      .concat(
        (symbol =
          unaccept.length == 1 ? "unacceptable symbol" : "unacceptable symbols")
      );
    return;
  }

  input.value = "";
  return minutes;
}

function valuesToArray(str) {
  if (!str) return;
  str.split("+").forEach(function(i) {
    if (i.includes("*")) {
      var tempArr = i.split("*");
      var mul = 1;

      if (tempArr.length >= 3) {
        for (var _i = 1; _i < tempArr.length; _i++) {
          mul *= parseInt(tempArr[_i]);
        }
      } else {
        mul = parseInt(tempArr[1]);
      }

      while (mul) {
        timers.push(tempArr[0]);
        mul--;
      }
    } else {
      timers.push(i);
    }
  });
  timers.reverse();
}

function timer(seconds) {
  clearInterval(countdown);
  displayNextTimers();
  displayTotalTime(timers);
  var now = Date.now();
  var then = now + seconds * 1000;
  displayTimeLeft(seconds);
  countdown = setInterval(function() {
    secondsLeft = Math.round((then - Date.now()) / 1000);

    if (secondsLeft < 0) {
      countdownOver();
      timers.pop();
      clearInterval(countdown);

      if (timers.length > 0) {
        timer(timers[timers.length - 1] * 60);
      } else {
        timerRunButton.textContent = "▶";
      }

      return;
    }

    displayTimeLeft(secondsLeft);
  }, 1000);
}

function timerStart(duration) {
  timer(duration);
  timerRunButton.textContent = "⏸";
}

function timersRun() {
  if (timerInput.value) {
    valuesToArray(inputValidate(timerInput));
    if (timers === undefined || timers.length == 0) return;
    timerStart(timers[timers.length - 1] * 60);
  } else {
    timerPauseResume();
  }
}

function timerPauseResume() {
  if (!countdown) return;

  if (timerRunButton.textContent === "⏸") {
    timerRunButton.textContent = "▶";
    clearInterval(countdown);
  } else {
    timerStart(secondsLeft);
  }
}

if (timersPredefined.length > 3) {
  displayTimersPredefinedSelect(timersPredefined);
  var predefinedSelect = document.getElementById("predefinedSelect");
  predefinedSelect.addEventListener("click", function(e) {
    if (e.currentTarget === e.target) return;
    valuesToArray(e.currentTarget.selectedOptions[0].innerHTML);
    timerStart(timers[timers.length - 1] * 60);
  });
} else {
  displayTimersPredefined(timersPredefined);
  displayArea.addEventListener("click", function(e) {
    if (e.target.tagName === "BUTTON") {
      valuesToArray(e.target.innerHTML);
      timerStart(timers[timers.length - 1] * 60);
    }
  });
}

timerRunButton.addEventListener("click", timersRun);
timerInput.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    timersRun();
  }
});
nextTimers.addEventListener("click", function(e) {
  var pos = e.target.dataset.arrpos;

  if (e.target.className === "deleteBtn") {
    timers.splice(pos, 1);
    displayNextTimers();
    displayTotalTime(timers);
  } else if (e.target.className === "startBtn") {
    timers.splice(pos);
    timers.reverse();
    var newTimers = timers.join("+");
    valuesToArray(newTimers);
    timerStart(timers[timers.length - 1] * 60);
  }
});
