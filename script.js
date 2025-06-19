// State
let state = { red:{ippon:0,waza:0,yuko:0,penalty:0}, blue:{ippon:0,waza:0,yuko:0,penalty:0}, firstScored:false };
let timerInterval=null, paused=false, totalSeconds=60;

// UI update
function updateDisplay(){
  ['ippon','waza','yuko','penalty'].forEach(type=>{
    document.getElementById('red-'+type).textContent = state.red[type];
    document.getElementById('blue-'+type).textContent = state.blue[type];
  });
  const redPts = state.red.ippon*3 + state.red.waza*2 + state.red.yuko;
  const bluePts = state.blue.ippon*3 + state.blue.waza*2 + state.blue.yuko;
  document.getElementById('red-score').textContent = redPts;
  document.getElementById('blue-score').textContent = bluePts;
  if(state.firstScored){
    document.getElementById('first-scorer').textContent = state.firstScored==='red' ? '赤:先取' : '青:先取';
  }
}

// Timer
function updateTimer(){
  const m=String(Math.floor(totalSeconds/60)).padStart(2,'0');
  const s=String(totalSeconds%60).padStart(2,'0');
  document.getElementById('timer').textContent = m + ':' + s;
}
function startTimer(){
  timerInterval = setInterval(()=>{
    if(!paused && totalSeconds>0){
      totalSeconds--; updateTimer();
      if(totalSeconds===15) beep();
      if(totalSeconds===0){ beep(); beep(); paused=true; }
    }
  },1000);
}
function beep(){
  const a=new AudioContext(), osc=a.createOscillator();
  osc.connect(a.destination); osc.frequency.value=1000; osc.start();
  setTimeout(()=>osc.stop(),200);
}

// Handlers
function changeScore(side,type,delta){
  const newVal = state[side][type] + delta;
  if(newVal>=0) state[side][type] = newVal;
  if(!state.firstScored && delta>0 && ['ippon','waza','yuko'].includes(type)){
    state.firstScored = side;
  }
  updateDisplay();
}
function stopTimer(){
  paused = true;
  clearInterval(timerInterval);
}

// Events
document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('.plus-btn').forEach(btn=>{
    btn.addEventListener('click',e=>{
      const sec=e.target.closest('.section');
      changeScore(sec.dataset.side,sec.dataset.type,1);
    });
  });
  document.querySelectorAll('.minus-btn').forEach(btn=>{
    btn.addEventListener('click',e=>{
      const sec=e.target.closest('.section');
      changeScore(sec.dataset.side,sec.dataset.type,-1);
    });
  });
  document.getElementById('timer-stop').addEventListener('click',stopTimer);
  document.getElementById('next-button').addEventListener('click',()=>{
    console.log('Submit',state);
    state={red:{ippon:0,waza:0,yuko:0,penalty:0},blue:{ippon:0,waza:0,yuko:0,penalty:0},firstScored:false};
    document.getElementById('match-id').textContent='ID: next';
    document.getElementById('next-button').textContent='NEXT: 赤 ? vs 青 ?';
    updateDisplay();
  });
  updateDisplay();
  updateTimer();
  startTimer();
});
