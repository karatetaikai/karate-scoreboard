// Timer logic
let totalSeconds = 60;
const timerEl = document.getElementById('timer');
function updateTimer() {
  const m = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const s = String(totalSeconds % 60).padStart(2, '0');
  timerEl.textContent = m + ':' + s;
}
function tick() {
  if (totalSeconds > 0) {
    totalSeconds--;
    updateTimer();
    if (totalSeconds === 15) beep();
    if (totalSeconds === 0) { beep(); beep(); clearInterval(timerInterval); }
  }
}
function beep() {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioCtx.createOscillator();
  oscillator.type = 'sine';
  oscillator.frequency.value = 1000;
  oscillator.connect(audioCtx.destination);
  oscillator.start();
  setTimeout(() => oscillator.stop(), 200);
}
updateTimer();
const timerInterval = setInterval(tick, 1000);

// NEXT button placeholder action
document.getElementById('next-button').addEventListener('click', () => {
  alert('NEXT: Send data and load next match');
});
