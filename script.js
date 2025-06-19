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

  // ctrl buttons
  document.querySelectorAll('button.ctrl').forEach(btn=>{
    btn.onclick = ()=> {
      const side = btn.dataset.side, action = btn.dataset.action;
      const el = document.getElementById(`${side}-${action.replace('-dec','')}`);
      let val = parseInt(el.textContent,10);
      if(action.endsWith('-dec')) val = Math.max(0, val-1);
      else val++;
      if(action==='penalty' && val>5) val=5;
      el.textContent = val;
      // clear first take if score changed to 0
      if(val===0) document.getElementById(`${side}-take`).classList.remove('active', side);
      updateScore();
    };
  });

  function updateScore(){
    const r = ['ippon','waza','yuko','penalty'].map(k=>parseInt(document.getElementById('red-'+k).textContent)).reduce((a,b)=>a+b,0);
    const b = ['ippon','waza','yuko','penalty'].map(k=>parseInt(document.getElementById('blue-'+k).textContent)).reduce((a,b)=>a+b,0);
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
    // swap take classes
    const rt = document.getElementById('red-take'), bt = document.getElementById('blue-take');
    const rActive = rt.classList.contains('active'), bActive = bt.classList.contains('active');
    if(rActive!==bActive){ rt.classList.toggle('active'); bt.classList.toggle('active'); }
  };
});
