// AudioContext for silent mobile unlock
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let audioUnlocked = false;

// Audio for beeps
const beep16 = new Audio('./1hue.mp3');
const beep0  = new Audio('./2hue.mp3');

// Timer initial settings
let preset = 60;
let remaining = preset;
let timerInterval = null;

// Update timer display
function updateTimer() {
  const m = String(Math.floor(remaining/60)).padStart(2,'0');
  const s = String(remaining%60).padStart(2,'0');
  document.getElementById('timer').textContent = `${m}:${s}`;
}

// Unlock audio on first interaction
function unlockAudio() {
  if (!audioUnlocked) {
    audioCtx.resume().then(() => { audioUnlocked = true; })
      .catch(e => console.warn('AudioContext resume failed', e));
  }
}

// Start timer
function startTimer() {
  unlockAudio();
  if (timerInterval) return;
  timerInterval = setInterval(() => {
    if (remaining > 0) {
      remaining--;
      updateTimer();
      if (remaining === 16 && audioUnlocked) {
        beep16.currentTime = 0;
        beep16.play().catch(()=>{});
      }
      if (remaining === 0 && audioUnlocked) {
        beep0.currentTime = 0;
        beep0.play().catch(()=>{});
        clearInterval(timerInterval);
        timerInterval = null;
      }
    }
  }, 1000);
}

// Stop timer
function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

// Reset timer
function resetTimer() {
  stopTimer();
  remaining = preset;
  updateTimer();
}

// Add/Subtract second
function plusSecond() { remaining++; updateTimer(); }
function minusSecond() { if (remaining>0) remaining--; updateTimer(); }

// Select preset time buttons
function selectPreset(btn) {
  preset = parseInt(btn.dataset.time, 10);
  document.querySelectorAll('.preset-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  resetTimer();
}

// Update next-button text from names
function updateNextText() {
  const redName = document.getElementById('red-name').textContent;
  const blueName = document.getElementById('blue-name').textContent;
  document.getElementById('next-button').textContent = `NEXT: 赤 ${redName} vs 青 ${blueName}`;
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Mobile audio unlock
  document.body.addEventListener('touchstart', unlockAudio, { once:true });
  document.body.addEventListener('click',    unlockAudio, { once:true });

  // Timer controls
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

  // Editable names
  ['red-name','blue-name'].forEach(id => {
    const el = document.getElementById(id);
    el.style.cursor = 'pointer';
    el.addEventListener('click', () => {
      const newName = prompt('選手名を入力してください', el.textContent);
      if (newName !== null && newName.trim() !== '') {
        el.textContent = newName.trim();
        updateNextText();
      }
    });
  });
  updateNextText();

  // Initial display
  updateTimer();
});
