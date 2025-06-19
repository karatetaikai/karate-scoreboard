// State（点数・先取状態）
let state = {
  red:   { ippon:0, waza:0, yuko:0, penalty:0 },
  blue:  { ippon:0, waza:0, yuko:0, penalty:0 },
  firstRed:  false,
  firstBlue: false
};

// タイマー初期値（秒）
let presetSeconds = 60;

// 音声ファイルをプリロード＆アンロック用フラグ
const oneHue = new Audio('./1hue.mp3');
const twoHue = new Audio('./2hue.mp3');
let audioUnlocked = false;

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

// 音声アンロック（ユーザー操作後に必ず一度だけ実行）
function unlockAudio() {
  if (audioUnlocked) return;
  // iOS Safari compatibility: resume AudioContext if needed
  if (window.audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  Promise.all([ oneHue.play(), twoHue.play() ])
    .then(() => {
      oneHue.pause();   oneHue.currentTime = 0;
      twoHue.pause();   twoHue.currentTime = 0;
      audioUnlocked = true;
    })
    .catch(err => {
      console.warn('Audio unlock failed:', err);
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
      if (totalSeconds === 16) {
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

// タイマー停止・リセット関数略…
// （以前の構造と同じ、上記コードをベースに残りの関数を含めてください）

document.addEventListener('DOMContentLoaded', () => {
  // Mobile unlock: first touch or click
  document.body.addEventListener('touchstart', unlockAudio, { once: true });
  document.body.addEventListener('click',     unlockAudio, { once: true });

  // ボタンクリックでタイマー操作
  document.getElementById('timer-start').addEventListener('click', startTimer);
  // ...（他のボタンイベント割り当ては同様に）
});
