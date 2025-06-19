document.addEventListener('DOMContentLoaded', () => {
  // Swap display
  document.getElementById('swap-display-btn').addEventListener('click', () => {
    document.getElementById('scoreboard').classList.toggle('swap-display');
  });

  // Timer logic...
  let preset = 60, total = preset, timerInterval, paused = true;
  const timerEl = document.getElementById('timer');
  function updateTimer(){timerEl.textContent = String(Math.floor(total/60)).padStart(2,'0')+':' + String(total%60).padStart(2,'0');}
  document.getElementById('timer-start').onclick = ()=>{paused=false; clearInterval(timerInterval); timerInterval=setInterval(()=>{ if(!paused&&total>0){total--;updateTimer();} },1000)};
  document.getElementById('timer-stop').onclick = ()=>{paused=true; clearInterval(timerInterval);};
  document.getElementById('timer-plus').onclick = ()=>{ total++; updateTimer(); };
  document.getElementById('timer-minus').onclick = ()=>{ if(total>0) total--; updateTimer(); };
  document.getElementById('timer-reset').onclick = ()=>{ paused=true; clearInterval(timerInterval); total=preset; updateTimer(); };
  updateTimer();

  // Score logic
  const state={red:{ippon:0,waza:0,yuko:0,penalty:0},blue:{ippon:0,waza:0,yuko:0,penalty:0},firstRed:false,firstBlue:false};
  function updateScores(){
    ['ippon','waza','yuko','penalty'].forEach(t=>{document.getElementById('red-'+t).textContent=state.red[t];document.getElementById('blue-'+t).textContent=state.blue[t];});
    document.getElementById('red-score').textContent=state.red.ippon*3+state.red.waza*2+state.red.yuko;
    document.getElementById('blue-score').textContent=state.blue.ippon*3+state.blue.waza*2+state.blue.yuko;
  }
  document.querySelectorAll('.plus-btn').forEach(btn=>btn.onclick=e=>{const s=e.target.closest('.section'); state[s.dataset.side][s.dataset.type]++; updateScores();});
  document.querySelectorAll('.minus-btn').forEach(btn=>btn.onclick=e=>{const s=e.target.closest('.section'); if(state[s.dataset.side][s.dataset.type]>0) state[s.dataset.side][s.dataset.type]--; updateScores();});
  document.getElementById('score-reset').onclick=()=>{['ippon','waza','yuko','penalty'].forEach(t=>{state.red[t]=state.blue[t]=0;}); state.firstRed=state.firstBlue=false; updateScores(); document.getElementById('first-red').style.background='#888';document.getElementById('first-blue').style.background='#888';};
  document.getElementById('first-red').onclick=()=>{state.firstRed=!state.firstRed; document.getElementById('first-red').style.background=state.firstRed?'red':'#888';};
  document.getElementById('first-blue').onclick=()=>{state.firstBlue=!state.firstBlue; document.getElementById('first-blue').style.background=state.firstBlue?'blue':'#888';};

  // Presets
  document.querySelectorAll('.preset-btn').forEach(btn=>btn.onclick=()=>{preset=parseInt(btn.dataset.time);document.querySelectorAll('.preset-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');total=preset;updateTimer();});
  document.querySelector('.preset-btn[data-time="60"]').click();

  // Next match
  document.getElementById('next-button').onclick=()=>{document.getElementById('match-id').textContent='ID: next'; document.getElementById('swap-display-btn').click();};

});
