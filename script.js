// Scoring and Timer Script for Karate Scoreboard

// State for scores and first-take
let state = {
  red:   { ippon: 0, waza: 0, yuko: 0, penalty: 0 },
  blue:  { ippon: 0, waza: 0, yuko: 0, penalty: 0 },
  firstRed: false,
  firstBlue: false
};

// Timer initial configuration
let presetSeconds = 60;
let remaining = presetSeconds;
let timerInterval = null;

// Audio for beep
const beep16 = new Audio('./1hue.mp3');
const beep0  = new Audio('./2hue.mp3');
let audioUnlocked = false;
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// Update timer display
function updateTimer() {
  const m = String(Math.floor(remaining / 60)).padStart(2, '0');
  const s = String(remaining % 60).padStart(2, '0');
  document.getElementById('timer').textContent = `${m}:${s}`;
}

// Unlock audio on user interaction (mobile compatibility)
function unlockAudio() {
  if (!audioUnlocked) {
    audioCtx.resume().then(() => { audioUnlocked = true; }).catch(() => {});
  }
}

// Timer controls
function startTimer() {
  unlockAudio();
  if (timerInterval) return;
  timerInterval = setInterval(() => {
    if (remaining > 0) {
      remaining--;
      updateTimer();
      if (remaining === 16) {
        beep16.currentTime = 0; beep16.play().catch(() => {});
      }
      if (remaining === 0) {
        beep0.currentTime = 0; beep0.play().catch(() => {});
        clearInterval(timerInterval);
        timerInterval = null;
      }
    }
  }, 1000);
}
function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}
function resetTimer() {
  stopTimer();
  remaining = presetSeconds;
  updateTimer();
}
function plusSecond() { remaining++; updateTimer(); }
function minusSecond() { if (remaining>0) remaining--; updateTimer(); }
function selectPreset(btn) {
  presetSeconds = parseInt(btn.dataset.time, 10);
  document.querySelectorAll('.preset-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  resetTimer();
}

// Update score display including weights: ippon=3, waza=2, yuko=1
function updateScores() {
  // Display individual counts
  ['ippon','waza','yuko','penalty'].forEach(type => {
    document.getElementById('red-'+type).textContent = state.red[type];
    document.getElementById('blue-'+type).textContent = state.blue[type];
  });
  // Compute weighted totals
  const redTotal = state.red.ippon*3 + state.red.waza*2 + state.red.yuko*1;
  const blueTotal = state.blue.ippon*3 + state.blue.waza*2 + state.blue.yuko*1;
  document.getElementById('red-score').textContent = redTotal;
  document.getElementById('blue-score').textContent = blueTotal;
}

// Change score counts, with penalty cap at 5
function changeScore(side, type, delta) {
  const current = state[side][type];
  let next = current + delta;
  if (type==='penalty') {
    next = Math.max(0, Math.min(5, next));
  } else {
    next = Math.max(0, next);
  }
  state[side][type] = next;
  updateScores();
}

// Toggle first-take and change button color
function toggleFirst(btnId) {
  const btn = document.getElementById(btnId);
  const isRed = (btnId==='first-red');
  const key = isRed ? 'firstRed' : 'firstBlue';
  state[key] = !state[key];
  btn.classList.toggle('active');
  btn.style.backgroundColor = state[key] ? (isRed ? 'red' : 'blue') : '#888';
}

// Reset all scores and first-take
function resetAll() {
  state.red = { ippon:0, waza:0, yuko:0, penalty:0 };
  state.blue = { ippon:0, waza:0, yuko:0, penalty:0 };
  state.firstRed = state.firstBlue = false;
  // Reset button styles
  ['first-red','first-blue'].forEach(id=>{
    const b = document.getElementById(id);
    b.classList.remove('active','red','blue');
    b.style.backgroundColor = '#888';
  });
  updateScores();
}

// Swap display of corners (preserves data)
function swapDisplay() {
  document.getElementById('container').classList.toggle('swap-display');
}

// Initialize event listeners on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  // Mobile audio unlock
  document.body.addEventListener('touchstart', unlockAudio, { once:true });
  document.body.addEventListener('click', unlockAudio, { once:true });

  // Timer buttons
  document.getElementById('timer-start').addEventListener('click', startTimer);
  document.getElementById('timer-stop').addEventListener('click', stopTimer);
  document.getElementById('timer-reset').addEventListener('click', resetTimer);
  document.getElementById('timer-plus').addEventListener('click', plusSecond);
  document.getElementById('timer-minus').addEventListener('click', minusSecond);

  // Preset time buttons
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', ()=>selectPreset(btn));
  });
  selectPreset(document.querySelector('.preset-btn[data-time="60"]'));

  // Score +/- buttons
  document.querySelectorAll('.plus-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const sec = e.target.closest('.section');
      changeScore(sec.dataset.side, sec.dataset.type, +1);
    });
  });
  document.querySelectorAll('.minus-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const sec = e.target.closest('.section');
      changeScore(sec.dataset.side, sec.dataset.type, -1);
    });
  });

  // Reset all button
  document.getElementById('score-reset').addEventListener('click', resetAll);

  // First-take buttons
  document.getElementById('first-red').addEventListener('click', ()=>toggleFirst('first-red'));
  document.getElementById('first-blue').addEventListener('click', ()=>toggleFirst('first-blue'));

  // Swap display
  document.getElementById('swap-display-btn').addEventListener('click', swapDisplay);

  // Next match resets
  document.getElementById('next-button').addEventListener('click', () => {
    resetAll();
    resetTimer();
    document.getElementById('match-id').textContent = 'ID: next';
  });

  // Initial update
  updateTimer();
  updateScores();
});
