/* Shared helpers for Game Corner games: storage, sounds, speech, confetti, Top 10 boards. */
window.GC = (function(){
  const $ = id => document.getElementById(id);
  const store = {
    get(k, d){ try{ const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); }catch(e){ return d; } },
    set(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }
  };

  let ac = null;
  function note(f, d, delay, type){
    try{
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      const t = ac.currentTime + (delay || 0), o = ac.createOscillator(), g = ac.createGain();
      o.type = type || 'triangle'; o.frequency.value = f;
      g.gain.setValueAtTime(.12, t); g.gain.exponentialRampToValueAtTime(.001, t + d);
      o.connect(g).connect(ac.destination); o.start(t); o.stop(t + d);
    }catch(e){}
  }
  const sound = {
    good(){ note(660,.12); note(880,.18,.09); },
    bad(){ note(300,.16); note(220,.22,.12); },
    tap(){ note(520,.05,0,'sine'); },
    pop(){ note(900,.06,0,'square'); note(1300,.05,.03,'sine'); },
    win(){ [523,659,784,1047].forEach((f,k)=>note(f,.3,k*.14)); },
    lose(){ [392,330,262].forEach((f,k)=>note(f,.3,k*.18)); }
  };

  const canSpeak = 'speechSynthesis' in window;
  function speak(text, rate){
    if(!canSpeak) return false;
    try{
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text); u.rate = rate || .85; u.lang = 'en-IN';
      speechSynthesis.speak(u); return true;
    }catch(e){ return false; }
  }

  function confetti(){
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cv = document.createElement('canvas'); cv.className = 'confetti'; document.body.appendChild(cv);
    const ctx = cv.getContext('2d'); cv.width = innerWidth; cv.height = innerHeight;
    const cols = ['#e63946','#2a7de1','#2e9d5b','#9b5de5','#f08c00','#d6338a','#0f9fa8'];
    const ps = [...Array(150)].map(()=>({x:Math.random()*cv.width,y:-20-Math.random()*cv.height*.5,vx:(Math.random()-.5)*3,vy:2+Math.random()*3,s:6+Math.random()*7,r:Math.random()*6,vr:(Math.random()-.5)*.3,c:cols[Math.floor(Math.random()*cols.length)]}));
    let t = 0;
    (function frame(){
      ctx.clearRect(0,0,cv.width,cv.height);
      ps.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.04;p.r+=p.vr;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.r);ctx.fillStyle=p.c;ctx.fillRect(-p.s/2,-p.s/4,p.s,p.s/2);ctx.restore();});
      if(++t < 220) requestAnimationFrame(frame); else cv.remove();
    })();
  }

  const fmtTime = s => { s = Math.floor(s); const m = Math.floor(s/60); return `${m}:${String(s%60).padStart(2,'0')}`; };
  const fmtDate = d => new Date(d).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'});
  const shuffle = a => { a = a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };

  /* Top 10 board.
     opts: key (storage key), better(a,b) -> negative if a ranks above b, show(entry) -> text for value column, valueLabel */
  function board(opts){
    const load = () => { const a = store.get(opts.key, []); return Array.isArray(a) ? a : []; };
    function add(entry){
      entry.d = Date.now();
      const list = load(); list.push(entry);
      list.sort((a,b)=> opts.better(a,b) || a.d - b.d);
      const top = list.slice(0,10); store.set(opts.key, top);
      return top.indexOf(entry);
    }
    function render(tbody, empty, highlight){
      const list = load(); tbody.innerHTML = '';
      empty.hidden = list.length > 0; tbody.closest('table').hidden = list.length === 0;
      list.forEach((e,k)=>{
        const tr = document.createElement('tr'); if(k === highlight) tr.className = 'me';
        [['r',k+1],['n',e.n],['d',fmtDate(e.d)],['v',opts.show(e)]].forEach(([c,v])=>{ const td=document.createElement('td'); td.className=c; td.textContent=v; tr.appendChild(td); });
        tbody.appendChild(tr);
      });
    }
    return { load, add, render };
  }
  const tableHTML = (valueLabel) => `<div class="tableWrap"><table class="lb"><thead><tr><th>#</th><th>Name</th><th>Date</th><th class="v">${valueLabel}</th></tr></thead><tbody></tbody></table></div><p class="empty">No scores yet. Be the first!</p>`;

  /* Name entry form that saves to a board, then calls done(rank, name). */
  function nameForm(form, input, onSave){
    input.value = store.get('gc-lastname', '');
    let saved = false;
    form.onsubmit = ev => {
      ev.preventDefault(); if(saved) return;
      const n = input.value.trim().slice(0,16); if(!n) return;
      saved = true; store.set('gc-lastname', n); form.hidden = true; onSave(n);
    };
    form.hidden = false;
    setTimeout(()=>{ try{ input.focus({preventScroll:true}); input.select(); }catch(e){} }, 60);
  }

  return { $, store, sound, speak, canSpeak, confetti, fmtTime, fmtDate, shuffle, board, tableHTML, nameForm };
})();
