// State
let state = { red:{ippon:0,waza:0,yuko:0,penalty:0}, blue:{ippon:0,waza:0,yuko:0,penalty:0}, firstRed:false, firstBlue:false };

// Timer functions (unchanged)
let timerInterval=null, paused=true, totalSeconds=60;
function updateTimer(){ const m=String(Math.floor(totalSeconds/60)).padStart(2,'0'); const s=String(totalSeconds%60).padStart(2,'0'); document.getElementById('timer').textContent=m+':'+s; }
function startTimer(){ paused=false; if(timerInterval) clearInterval(timerInterval); timerInterval=setInterval(()=>{ if(!paused&&totalSeconds>0){ totalSeconds--; updateTimer(); } },1000); }
function stopTimer(){ paused=true; if(timerInterval) clearInterval(timerInterval); }

// Score functions
function updateScores(){
  ['ippon','waza','yuko','penalty'].forEach(type=>{
    document.getElementById('red-'+type).textContent=state.red[type];
    document.getElementById('blue-'+type).textContent=state.blue[type];
  });
  const redPts=state.red.ippon*3+state.red.waza*2+state.red.yuko;
  const bluePts=state.blue.ippon*3+state.blue.waza*2+state.blue.yuko;
  document.getElementById('red-score').textContent=redPts;
  document.getElementById('blue-score').textContent=bluePts;
}
function changeScore(side,type,delta){
  const newVal=state[side][type]+delta;
  if(type==='penalty'){ if(newVal>=0&&newVal<=5) state[side][type]=newVal; }
  else if(newVal>=0){ state[side][type]=newVal; }
  updateScores();
}

// First-take functions
function toggleFirst(buttonId){
  const btn=document.getElementById(buttonId);
  const side=buttonId==='first-red'?'red':'blue';
  const stateKey=buttonId==='first-red'?'firstRed':'firstBlue';
  state[stateKey]=!state[stateKey];
  btn.style.backgroundColor= state[stateKey] ? (side==='red'?'red':'blue') : '#888';
}
function clearFirst(){
  state.firstRed=false; state.firstBlue=false;
  document.getElementById('first-red').style.backgroundColor='#888';
  document.getElementById('first-blue').style.backgroundColor='#888';
}

// Settings modal handlers
function openSettings(){ document.getElementById('settings-modal').classList.remove('hidden'); }
function closeSettings(){ document.getElementById('settings-modal').classList.add('hidden'); }

// Events
document.addEventListener('DOMContentLoaded',()=>{
  // Timer
  document.getElementById('timer-start').addEventListener('click',startTimer);
  document.getElementById('timer-stop').addEventListener('click',stopTimer);
  document.getElementById('timer-plus').addEventListener('click',()=>{ totalSeconds++; updateTimer(); });
  document.getElementById('timer-minus').addEventListener('click',()=>{ if(totalSeconds>0) totalSeconds--; updateTimer(); });

  // Scores
  document.querySelectorAll('.plus-btn').forEach(btn=>btn.addEventListener('click',e=>{
    const sec=e.target.closest('.section'); changeScore(sec.dataset.side, sec.dataset.type,1);
  }));
  document.querySelectorAll('.minus-btn').forEach(btn=>btn.addEventListener('click',e=>{
    const sec=e.target.closest('.section'); changeScore(sec.dataset.side, sec.dataset.type,-1);
  }));

  // First-take toggles
  document.getElementById('first-red').addEventListener('click',()=>toggleFirst('first-red'));
  document.getElementById('first-blue').addEventListener('click',()=>toggleFirst('first-blue'));

  // Clear-first inline
  document.getElementById('modal-clear-first').addEventListener('click',clearFirst);

  // Settings modal
  document.getElementById('settings').addEventListener('click',openSettings);
  document.getElementById('close-settings').addEventListener('click',closeSettings);

  // Next match
  document.getElementById('next-button').addEventListener('click',()=>{
    state={ red:{ippon:0,waza:0,yuko:0,penalty:0}, blue:{ippon:0,waza:0,yuko:0,penalty:0}, firstRed:false, firstBlue:false };
    clearFirst(); updateScores(); updateTimer();
    document.getElementById('match-id').textContent='ID: next';
  });

  // Initialize
  updateTimer(); updateScores();
});
