// State
let state = {
  red: { ippon:0, waza:0, yuko:0, penalty:0 },
  blue:{ ippon:0, waza:0, yuko:0, penalty:0 },
  firstScored: false
};
let timerInterval = null;
let editing = false;
let paused = false;
let totalSeconds = 60;

// Update display
function updateDisplay() {
  document.getElementById('red-ippon').textContent = state.red.ippon;
  document.getElementById('red-waza').textContent = state.red.waza;
  document.getElementById('red-yuko').textContent = state.red.yuko;
  document.getElementById('red-penalty').textContent = state.red.penalty;
  document.getElementById('blue-ippon').textContent = state.blue.ippon;
  document.getElementById('blue-waza').textContent = state.blue.waza;
  document.getElementById('blue-yuko').textContent = state.blue.yuko;
  document.getElementById('blue-penalty').textContent = state.blue.penalty;
  const redPts = state.red.ippon*3 + state.red.waza*2 + state.red.yuko;
  const bluePts = state.blue.ippon*3 + state.blue.waza*2 + state.blue.yuko;
  document.getElementById('red-score').textContent = redPts;
  document.getElementById('blue-score').textContent = bluePts;
  if(state.firstScored) {
    const sc = state.firstScored === 'red' ? '赤: 先取' : '青: 先取';
    document.getElementById('first-scorer').textContent = sc;
  }
}

// Timer functions
function updateTimerText() {
  const m = String(Math.floor(totalSeconds/60)).padStart(2,'0');
  const s = String(totalSeconds%60).padStart(2,'0');
  document.getElementById('timer').textContent = m + ':' + s;
}
function startTimer() {
  if(timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if(!paused && totalSeconds>0) {
      totalSeconds--;
      updateTimerText();
      if(totalSeconds === 15) beep();
      if(totalSeconds === 0) { beep(); beep(); paused=true; }
    }
  }, 1000);
}
function beep() {
  const audioCtx = new (window.AudioContext||window.webkitAudioContext)();
  const osc = audioCtx.createOscillator();
  osc.type='sine'; osc.frequency.value=1000; osc.connect(audioCtx.destination);
  osc.start(); setTimeout(() => osc.stop(),200);
}

// Event handlers
['ippon','waza','yuko'].forEach(type => {
  ['red','blue'].forEach(side => {
    document.addEventListener('click', function(e){
      if(e.target.id === side+'-'+type || e.target.parentElement.id === side+'-'+type){
        state[side][type]++;
        if(!state.firstScored) state.firstScored = side;
        updateDisplay();
      }
    });
  });
});
['red','blue'].forEach(side => {
  document.addEventListener('click', function(e){
    if(e.target.id === side+'-penalty' || e.target.parentElement.id === side+'-penalty'){
      if(state[side].penalty < 5) state[side].penalty++;
      updateDisplay();
    }
  });
});
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('next-button').addEventListener('click', () => {
    console.log('Submit', state);
    state = { red:{ippon:0,waza:0,yuko:0,penalty:0}, blue:{ippon:0,waza:0,yuko:0,penalty:0}, firstScored:false };
    document.getElementById('match-id').textContent='ID: next';
    document.getElementById('next-button').textContent='NEXT: 赤 ? vs 青 ?';
    updateDisplay();
  });

  // Timer click: toggle pause/edit
  const banner = document.getElementById('timer-banner');
  banner.addEventListener('click', () => {
    if(!editing) {
      paused = true; editing = true;
      document.querySelectorAll('.time-edit').forEach(b=>b.style.display='block');
    } else {
      paused = false; editing = false;
      document.querySelectorAll('.time-edit').forEach(b=>b.style.display='none');
    }
  });
  // Time adjust
  document.getElementById('time-plus').addEventListener('click', e=>{
    e.stopPropagation(); totalSeconds++; updateTimerText();
  });
  document.getElementById('time-minus').addEventListener('click', e=>{
    e.stopPropagation(); if(totalSeconds>0) totalSeconds--; updateTimerText();
  });

  // Start
  updateDisplay();
  updateTimerText();
  startTimer();
});
