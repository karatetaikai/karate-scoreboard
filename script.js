// State
let state = { red:{ippon:0,waza:0,yuko:0,penalty:0}, blue:{ippon:0,waza:0,yuko:0,penalty:0}, firstScored:false };

// Timer
let timerInterval = null, paused = true, totalSeconds = 60;
function updateDisplay(){
  ['ippon','waza','yuko','penalty'].forEach(type=>{
    document.getElementById('red-'+type).textContent = state.red[type];
    document.getElementById('blue-'+type).textContent = state.blue[type];
  });
  const redPts = state.red.ippon*3 + state.red.waza*2 + state.red.yuko;
  const bluePts = state.blue.ippon*3 + state.blue.waza*2 + state.blue.yuko;
  document.getElementById('red-score').textContent = redPts;
  document.getElementById('blue-score').textContent = bluePts;
  document.getElementById('first-scorer').textContent = state.firstScored ? (state.firstScored==='red'?'赤:先取':'青:先取') : '';
}
function updateTimer(){
  const m=String(Math.floor(totalSeconds/60)).padStart(2,'0');
  const s=String(totalSeconds%60).padStart(2,'0');
  document.getElementById('timer').textContent = m+':'+s;
}
function startTimer(){
  paused=false;
  if(timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(()=>{
    if(!paused && totalSeconds>0){
      totalSeconds--; updateTimer();
      if(totalSeconds===15) beep();
      if(totalSeconds===0){ beep(); beep(); paused=true; }
    }
  },1000);
}
function stopTimer(){
  paused=true;
  if(timerInterval) clearInterval(timerInterval);
}
function beep(){
  const ctx=new AudioContext(),osc=ctx.createOscillator();
  osc.connect(ctx.destination);osc.frequency.value=1000;osc.start();
  setTimeout(()=>osc.stop(),200);
}

// Score change
function changeScore(side,type,delta){
  const newVal = state[side][type] + delta;
  if(type==='penalty'){
    if(newVal>=0 && newVal<=5) state[side][type]=newVal;
  } else if(newVal>=0){
    state[side][type]=newVal;
    // clear firstScored if all points zero
    if(newVal===0 && ['ippon','waza','yuko'].includes(type)){
      const total = state[side].ippon + state[side].waza + state[side].yuko;
      if(total===0 && state.firstScored===side){
        state.firstScored=false;
      }
    }
  }
  if(!state.firstScored && delta>0 && ['ippon','waza','yuko'].includes(type)){
    state.firstScored=side;
  }
  updateDisplay();
}

// Events
document.addEventListener('DOMContentLoaded',()=>{
  document.getElementById('timer-start').addEventListener('click',startTimer);
  document.getElementById('timer-stop').addEventListener('click',stopTimer);
  document.getElementById('timer-plus').addEventListener('click',e=>{ totalSeconds++; updateTimer(); });
  document.getElementById('timer-minus').addEventListener('click',e=>{ if(totalSeconds>0) totalSeconds--; updateTimer(); });

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

  document.getElementById('clear-first').addEventListener('click',()=>{
    state.firstScored=false; updateDisplay();
  });

  document.getElementById('next-button').addEventListener('click',()=>{
    console.log('Submit',state);
    state={red:{ippon:0,waza:0,yuko:0,penalty:0},blue:{ippon:0,waza:0,yuko:0,penalty:0},firstScored:false};
    document.getElementById('match-id').textContent='ID: next';
    document.getElementById('next-button').textContent='NEXT: 赤 ? vs 青 ?';
    updateDisplay(); updateTimer();
  });

  updateDisplay(); updateTimer();
});
