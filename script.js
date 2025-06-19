// State（点数・先取状態）
let state = {
  red:   { ippon:0, waza:0, yuko:0, penalty:0 },
  blue:  { ippon:0, waza:0, yuko:0, penalty:0 },
  firstRed:  false,
  firstBlue: false
};

// タイマー初期値（秒）
let presetSeconds = 60;

// AudioContext for silent mobile unlock
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let audioUnlocked = false;

// 音声ファイル for 16s and 0s
const oneHue = new Audio('./1hue.mp3');
const twoHue = new Audio('./2hue.mp3');

// タイマー変数
let timerInterval = null;
let paused        = true;
let totalSeconds  = presetSeconds;

// タイマー表示を更新
function updateTimer() {
  const m = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const s = String(totalSeconds % 60).padStart(2, '0');
  document.getElementById('timer').textContent = `${m}:${s}`;
}

// 音声アンロック（ユーザー操作でAudioContextをresumeのみ）
function unlockAudio() {
  if (audioUnlocked) return;
  audioCtx.resume().then(() => {
    audioUnlocked = true;
  }).catch(err => {
    console.warn('AudioContext resume failed:', err);
  });
}

// タイマー開始
function startTimer() {
  unlockAudio();
  paused = false;
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (!paused && totalSeconds > 0) {
      totalSeconds--;
      updateTimer();
      if (totalSeconds === 16 && audioUnlocked) {
        oneHue.currentTime = 0;
        oneHue.play().catch(err => console.warn('16秒音鳴らず', err));
      }
      if (totalSeconds === 0) {
        twoHue.currentTime = 0;
        twoHue.play().catch(err => console.warn('0秒音鳴らず', err));
        paused = true;
        clearInterval(timerInterval);
      }
    }
  }, 1000);
}

// タイマー停止
function stopTimer() {
  paused = true;
  if (timerInterval) clearInterval(timerInterval);
}

// タイマーリセット
function resetTimer() {
  paused        = true;
  if (timerInterval) clearInterval(timerInterval);
  totalSeconds  = presetSeconds;
  updateTimer();
}

// 以下、スコア更新やその他の関数は既存コードと同様です。
// (省略) あなたの既存のスコア管理コードをここに統合してください

// DOMContentLoaded でイベントを設定
document.addEventListener('DOMContentLoaded', () => {
  // Mobile unlock: first touch or click
  document.body.addEventListener('touchstart', unlockAudio, { once: true });
  document.body.addEventListener('click',     unlockAudio, { once: true });

  // タイマー操作
  document.getElementById('timer-start').addEventListener('click', startTimer);
  document.getElementById('timer-stop').addEventListener('click', stopTimer);
  document.getElementById('timer-plus').addEventListener('click',  () => { totalSeconds++; updateTimer(); });
  document.getElementById('timer-minus').addEventListener('click', () => { if (totalSeconds>0) totalSeconds--; updateTimer(); });
  document.getElementById('timer-reset').addEventListener('click', resetTimer);

  // 初期表示
  updateTimer();
});
