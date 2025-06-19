// Swap display feature
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('swap-display-btn');
  const board = document.getElementById('scoreboard');
  btn.addEventListener('click', () => {
    board.classList.toggle('swap-display');
  });
});