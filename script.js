document.addEventListener('DOMContentLoaded', () => {
  const timerEl = document.getElementById('time');
  let total = 60, interval = null;
  function updateTimer() {
    const m = Math.floor(total/60), s = total%60;
    timerEl.textContent = (m<10?'0':'')+m+':'+(s<10?'0':'')+s;
  }
  document.getElementById('start-btn').onclick = () => {
    if (!interval) interval = setInterval(()=>{ if(total>0){ total--; if(total===16) new Audio('1hue.mp3').play(); if(total===0) new Audio('2hue.mp3').play(); updateTimer(); }},1000);
  };
  document.getElementById('stop-btn').onclick = () => { clearInterval(interval); interval=null; };
  document.getElementById('add-time-btn').onclick = ()=>{ total++; updateTimer(); };
  document.getElementById('minus-time-btn').onclick = ()=>{ if(total>0) total--; updateTimer(); };
  document.getElementById('reset-time-btn').onclick = ()=>{ total=defaultTime; updateTimer(); };
  const defaultTime=60;

  document.querySelectorAll('button.ctrl').forEach(btn=>{
    btn.onclick = ()=> {
      const side = btn.dataset.side, action = btn.dataset.action;
      const el = document.getElementById(`${side}-${action.replace('-dec','')}`);
      let val = parseInt(el.textContent,10);
      if(action.endsWith('-dec')) val = Math.max(0, val-1);
      else val++;
      if(action==='penalty' && val>5) val=5;
      el.textContent = val;
      updateScore();
      if(val===0) document.getElementById(`${side}-take`).classList.remove('active', side);
    };
  });

  function updateScore(){
    const r3 = parseInt(document.getElementById('red-ippon').textContent) * 3;
    const r2 = parseInt(document.getElementById('red-waza').textContent) * 2;
    const r1 = parseInt(document.getElementById('red-yuko').textContent) * 1;
    const b3 = parseInt(document.getElementById('blue-ippon').textContent) * 3;
    const b2 = parseInt(document.getElementById('blue-waza').textContent) * 2;
    const b1 = parseInt(document.getElementById('blue-yuko').textContent) * 1;
    const r = r3 + r2 + r1;
    const b = b3 + b2 + b1;
    document.getElementById('red-score').textContent = r;
    document.getElementById('blue-score').textContent = b;
  }

  document.getElementById('red-take').onclick = ()=> {
    document.getElementById('red-take').classList.toggle('active'); document.getElementById('red-take').classList.toggle('red');
  };
  document.getElementById('blue-take').onclick = ()=> {
    document.getElementById('blue-take').classList.toggle('active'); document.getElementById('blue-take').classList.toggle('blue');
  };

  document.getElementById('swap-btn').onclick = ()=>{
    document.getElementById('container').classList.toggle('swap-display');
    ['name','score','ippon','waza','yuko','penalty'].forEach(key=>{
      const rid = document.getElementById('red-'+key), bid = document.getElementById('blue-'+key);
      const tmp = rid.textContent; rid.textContent = bid.textContent; bid.textContent = tmp;
    });
    const rt = document.getElementById('red-take'), bt = document.getElementById('blue-take');
    const rActive = rt.classList.contains('active'), bActive = bt.classList.contains('active');
    if(rActive!==bActive){ rt.classList.toggle('active'); bt.classList.toggle('active'); }
  };
});
