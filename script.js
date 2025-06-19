
// AudioContext for mobile
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let audioUnlocked = false;
const beep16 = new Audio('./1hue.mp3');
const beep0  = new Audio('./2hue.mp3');

// Timer
let preset = 60, remaining = preset, timerInterval = null;
function updateTimer(){ const m=String(Math.floor(remaining/60)).padStart(2,'0'); const s=String(remaining%60).padStart(2,'0'); document.getElementById('timer').textContent=`${m}:${s}`; }
function unlockAudio(){ if(!audioUnlocked){ audioCtx.resume().then(()=>{audioUnlocked=true;}).catch(()=>{});} }
function startTimer(){ unlockAudio(); if(timerInterval)return; timerInterval=setInterval(()=>{ if(remaining>0){ remaining--; updateTimer(); if(remaining===16){ beep16.currentTime=0; beep16.play().catch(()=>{});} if(remaining===0){ beep0.currentTime=0; beep0.play().catch(()=>{}); clearInterval(timerInterval); timerInterval=null; } } },1000);}
function stopTimer(){ if(timerInterval){ clearInterval(timerInterval); timerInterval=null;} }
function resetTimer(){ stopTimer(); remaining=preset; updateTimer(); }
function plusSecond(){ remaining++; updateTimer(); }
function minusSecond(){ if(remaining>0)remaining--; updateTimer(); }
function selectPreset(btn){ preset=parseInt(btn.dataset.time,10); document.querySelectorAll('.preset-btn').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); resetTimer(); }

// Scores
let state={red:{ippon:0,waza:0,yuko:0,penalty:0},blue:{ippon:0,waza:0,yuko:0,penalty:0},firstRed:false,firstBlue:false};
function updateScores(){ 
  ['ippon','waza','yuko','penalty'].forEach(t=>{document.getElementById('red-'+t).textContent = state.red[t]; document.getElementById('blue-'+t).textContent = state.blue[t];});
  const r = state.red.ippon*3 + state.red.waza*2 + state.red.yuko*1;
  const b = state.blue.ippon*3 + state.blue.waza*2 + state.blue.yuko*1;
  document.getElementById('red-score').textContent = r;
  document.getElementById('blue-score').textContent = b;
}
function changeScore(side,type,delta){
  let v = state[side][type] + delta;
  if(type==='penalty'){ v = Math.max(0, Math.min(5, v)); }
  else { v = Math.max(0, v); }
  state[side][type] = v;
  updateScores();
}

function toggleFirst(id){
  const btn = document.getElementById(id);
  const isRed = id==='first-red';
  const key = isRed?'firstRed':'firstBlue';
  // Reset both buttons before applying the new state
  document.getElementById('first-red').style.backgroundColor = '#888';
  document.getElementById('first-blue').style.backgroundColor = '#888';
  
  // Toggle state and color of the clicked button
  state[key] = !state[key];
  btn.style.backgroundColor = state[key] ? (isRed ? 'red' : 'blue') : '#888';
}


// DOM ready
document.addEventListener('DOMContentLoaded',()=>{
  document.body.addEventListener('touchstart', unlockAudio, {once:true});
  document.body.addEventListener('click', unlockAudio, {once:true});
  // Timer
  document.getElementById('timer-start').addEventListener('click', startTimer);
  document.getElementById('timer-stop').addEventListener('click', stopTimer);
  document.getElementById('timer-reset').addEventListener('click', resetTimer);
  document.getElementById('timer-plus').addEventListener('click', plusSecond);
  document.getElementById('timer-minus').addEventListener('click', minusSecond);
  document.querySelectorAll('.preset-btn').forEach(btn=>btn.addEventListener('click',()=>selectPreset(btn)));
  selectPreset(document.querySelector('.preset-btn[data-time="60"]'));
  // Score buttons
  document.querySelectorAll('.plus-btn').forEach(btn=>btn.addEventListener('click', e=>{
    const s = e.target.closest('.section');
    changeScore(s.dataset.side, s.dataset.type, 1);
  }));
  document.querySelectorAll('.minus-btn').forEach(btn=>btn.addEventListener('click', e=>{
    const s = e.target.closest('.section');
    changeScore(s.dataset.side, s.dataset.type, -1);
  }));
  // Reset scores
  document.getElementById('score-reset').addEventListener('click',()=>{
    state.red={ippon:0,waza:0,yuko:0,penalty:0};
    state.blue={ippon:0,waza:0,yuko:0,penalty:0};
    state.firstRed = state.firstBlue = false;
    ['first-red','first-blue'].forEach(id=>{
      const b = document.getElementById(id);
      b.className='first-btn';
    });
    updateScores();
  });
  // First-take buttons
  document.getElementById('first-red').addEventListener('click', ()=>toggleFirst('first-red'));
  document.getElementById('first-blue').addEventListener('click', ()=>toggleFirst('first-blue'));
  // Initial update
  updateTimer();
  updateScores();
});
