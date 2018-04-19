let countdown,secondsLeft,timers=[];const timersPredefined=['15+5+15+9+15','15+15+15','15+10+15','15+10+15+8+15+10+15'],nextTimers=document.getElementById('nextTimers'),displayArea=document.getElementById('displayArea'),timerInput=document.getElementById('timerInput'),timerRunButton=document.getElementById('timerRun'),timerDisplay=document.querySelector('.displayTimeLeft'),timerTotalTime=document.querySelector('.displayTimeTotal'),soundComplete=document.getElementById('complete');function countdownOver(){soundComplete.play()}function secondsToTimeLeftString(a){const b=Math.floor(a/60),c=a%60,d=`${b}:${10>c?'0':''}${c}`;return d}function displayTimeLeft(a){let b=secondsToTimeLeftString(a);document.title=b,timerDisplay.textContent=b}function displayTotalTime(a){if(1==a.length)return void(timerTotalTime.textContent='');let b=a.reduce((b,a)=>parseInt(b)+parseInt(a));timerTotalTime.textContent=`total timers time is: ${b} ${1==b?'minute':'minutes'}`}function displayTimersPredefined(a){const b=document.createDocumentFragment();for(let c=0;c<a.length;c++){const d=document.createElement('button');d.className='display__time-predefined',d.innerHTML=a[c],b.appendChild(d)}displayArea.appendChild(b)}function displayTimersPredefinedSelect(a){const b=document.createDocumentFragment(),c=document.createElement('select');c.setAttribute('id','predefinedSelect');for(let b=0;b<a.length;b++){const d=document.createElement('option');d.className='display__time-predefined',d.innerHTML=a[b],c.appendChild(d)}b.appendChild(c),displayArea.appendChild(b)}function displayNextTimers(){if(nextTimers.hasChildNodes()&&(nextTimers.innerHTML=''),1==timers.length){const a=document.createElement('li');a.className='nextTimers__item',a.innerHTML='No more timers',nextTimers.appendChild(a)}else{const a=document.createDocumentFragment();for(let b=timers.length-2;0<=b;b--){const c=document.createElement('li'),d=document.createElement('button');d.className='startBtn',d.setAttribute('data-arrPos',b+1-timers.length),d.innerHTML=timers[b];const e=document.createElement('button');e.className='deleteBtn',e.setAttribute('data-arrPos',b-timers.length),e.innerHTML='delete',c.className='nextTimers__item',c.appendChild(d),c.appendChild(e),a.appendChild(c)}nextTimers.appendChild(a)}}function valuesToArray(a){let b;a.value?(b=a.value,a.value=''):b=a,timers=b.split('+'),timers.reverse()}function timer(a){clearInterval(countdown),displayNextTimers(),displayTotalTime(timers);const b=Date.now();displayTimeLeft(a),countdown=setInterval(()=>(secondsLeft=Math.round((b+1e3*a-Date.now())/1e3),0>secondsLeft?(countdownOver(),timers.pop(),clearInterval(countdown),void(0<timers.length?timer(60*timers[timers.length-1]):timerRunButton.textContent='\u25B6')):void displayTimeLeft(secondsLeft)),1e3)}function timerStart(a){timer(a),timerRunButton.textContent='\u23F8'}function timersRun(){timerInput.value?(valuesToArray(timerInput),timerStart(60*timers[timers.length-1])):timerPauseResume()}function timerPauseResume(){countdown&&('\u23F8'===timerRunButton.textContent?(timerRunButton.textContent='\u25B6',clearInterval(countdown)):timerStart(secondsLeft))}if(3<timersPredefined.length){displayTimersPredefinedSelect(timersPredefined);const a=document.getElementById('predefinedSelect');a.addEventListener('click',(a)=>{valuesToArray(a.target.selectedOptions[0].innerHTML),timerStart(60*timers[timers.length-1])})}else displayTimersPredefined(timersPredefined),displayArea.addEventListener('click',(a)=>{'BUTTON'===a.target.tagName&&(valuesToArray(a.target.innerHTML),timerStart(60*timers[timers.length-1]))});timerRunButton.addEventListener('click',timersRun),timerInput.addEventListener('keypress',function(a){'Enter'===a.key&&(a.preventDefault(),timersRun())}),nextTimers.addEventListener('click',(a)=>{const b=a.target.dataset.arrpos;if('deleteBtn'===a.target.className)timers.splice(b,1),displayNextTimers(),displayTotalTime(timers);else if('startBtn'===a.target.className){timers.splice(b),timers.reverse();let a=timers.join('+');valuesToArray(a),timerStart(60*timers[timers.length-1])}});