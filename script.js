// State
let state = { red:{ippon:0,waza:0,yuko:0,penalty:0}, blue:{ippon:0,waza:0,yuko:0,penalty:0}, firstRed:false, firstBlue:false };

// Timer functions
let timerInterval=null, paused=true, totalSeconds=60;
function updateTimer(){ const m=String(Math.floor(totalSeconds/60)).padStart(2,'0'); const s=String(totalSeconds%60).padStart(2,'0'); document.getElementById('timer').textContent = m+':'+s; }
function startTimer(){ paused=false; if(timerInterval) clearInterval(timerInterval); timerInterval=setInterval(()=>{ if(!paused && totalSeconds>0){ totalSeconds--; updateTimer(); if(totalSeconds===15) beep(); } },1000); }
function stopTimer(){ paused=true; if(timerInterval) clearInterval(timerInterval); }
function beep(){ const ctx=new AudioContext(), osc=ctx.createOscillator(); osc.connect(ctx.destination); osc.frequency.value=1000; osc.start(); setTimeout(()=>osc.stop(),200); }

// Score functions
function updateScores(){ ['ippon','waza','yuko','penalty'].forEach(type=>{ document.getElementById('red-'+type).textContent=state.red[type]; document.getElementById('blue-'+type).textContent=state.blue[type]; }); document.getElementById('red-score').textContent = state.red.ippon*3 + state.red.waza*2 + state.red.yuko; document.getElementById('blue-score').textContent = state.blue.ippon*3 + state.blue.waza*2 + state.blue.yuko; }
function changeScore(side,type,delta){ const newVal = state[side][type]+delta; if(type==='penalty'){ if(newVal>=0 && newVal<=5) state[side][type]=newVal; } else if(newVal>=0){ state[side][type]=newVal; } updateScores(); }

// First-take toggles
function toggleFirstRed(){ state.firstRed = !state.firstRed; document.getElementById('first-red').style.backgroundColor = state.firstRed ? 'red' : '#888'; }
function toggleFirstBlue(){ state.firstBlue = !state.firstBlue; document.getElementById('first-blue').style.backgroundColor = state.firstBlue ? 'blue' : '#888'; }

// Events
document.addEventListener('DOMContentLoaded',()=>{
  document.getElementById('timer-start').addEventListener('click',startTimer);
  document.getElementById('timer-stop').addEventListener('click',stopTimer);
  document.getElementById('timer-plus').addEventListener('click',()=>{ totalSeconds++; updateTimer(); });
  document.getElementById('timer-minus').addEventListener('click',()=>{ if(totalSeconds>0) totalSeconds--; updateTimer(); });

  document.querySelectorAll('.plus-btn').forEach(btn=>btn.addEventListener('click',e=>{ const sec=e.target.closest('.section'); changeScore(sec.dataset.side, sec.dataset.type,1);}));  
  document.querySelectorAll('.minus-btn').forEach(btn=>btn.addEventListener('click',e=>{ const sec=e.target.closest('.section'); changeScore(sec.dataset.side, sec.dataset.type,-1);}));  

  document.getElementById('first-red').addEventListener('click',toggleFirstRed);
  document.getElementById('first-blue').addEventListener('click',toggleFirstBlue);

  document.getElementById('next-button').addEventListener('click',()=>{
    state={ red:{ippon:0,waza:0,yuko:0,penalty:0}, blue:{ippon:0,waza:0,yuko:0,penalty:0}, firstRed:false, firstBlue:false };
    updateScores(); updateTimer();
    document.getElementById('first-red').style.backgroundColor='#888'; document.getElementById('first-blue').style.backgroundColor='#888';
    document.getElementById('match-id').textContent='ID: next';
  });

  updateTimer(); updateScores();
});
