const SYMBOLS=["🍕","🍔","🍟","🌮","🍩","🍪","🍫","🍒","🍉","🍎","🥨","🍰","🧁","🥝","🍓","🍇"];
const grid=document.getElementById("grid");
const timeEl=document.getElementById("time");
const movesEl=document.getElementById("moves");
const bestEl=document.getElementById("best");
const restartBtn=document.getElementById("restart");
const popup=document.getElementById("popup");
const popupStats=document.getElementById("popup-stats");
const closePopup=document.getElementById("close-popup");

let first,second,lock,matches,totalPairs,moves,timer,seconds,started;

function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function pad(n){return n<10?"0"+n:n}
function format(s){return `${pad(Math.floor(s/60))}:${pad(s%60)}`}
function getBest(){try{return JSON.parse(localStorage.getItem("best-memory"))}catch{return null}}
function setBest(obj){localStorage.setItem("best-memory",JSON.stringify(obj))}
function renderBest(){const b=getBest();bestEl.textContent=b?`${b.moves} mv • ${format(b.time)}`:"—"}

function setup(){
  first=second=null;lock=false;matches=0;moves=0;seconds=0;started=false;
  clearInterval(timer);
  timeEl.textContent="00:00";movesEl.textContent="0";
  const pairs=window.matchMedia("(min-width:700px)").matches?12:8;totalPairs=pairs;
  const deck=shuffle([...SYMBOLS.slice(0,pairs),...SYMBOLS.slice(0,pairs)]);
  grid.innerHTML="";
  deck.forEach(s=>{
    const c=document.createElement("div");
    c.className="card";
    c.innerHTML=`<div class="face front">★</div><div class="face back">${s}</div>`;
    c.dataset.s=s;
    c.onclick=()=>flip(c);
    grid.appendChild(c);
  });
  renderBest();
  popup.classList.remove("show");
}

function startTimer(){if(started)return;started=true;timer=setInterval(()=>{seconds++;timeEl.textContent=format(seconds)},1000)}

function flip(card){
  if(lock||card.classList.contains("flipped"))return;
  startTimer();card.classList.add("flipped");
  if(!first){first=card;return}
  second=card;lock=true;moves++;movesEl.textContent=moves;
  if(first.dataset.s===second.dataset.s){
    first.classList.add("matched");second.classList.add("matched");
    [first,second]=[null,null];lock=false;matches++;
    if(matches===totalPairs)win()
  }else{
    setTimeout(()=>{first.classList.remove("flipped");second.classList.remove("flipped");[first,second]=[null,null];lock=false},800)
  }
}

function win(){
  clearInterval(timer);
  const current={moves,time:seconds};
  const best=getBest();
  if(!best||current.moves<best.moves||(current.moves===best.moves&&current.time<best.time))setBest(current);
  renderBest();
  popupStats.textContent=`You finished in ${moves} moves and ${format(seconds)}.`;
  popup.classList.add("show");
}

restartBtn.onclick=setup;
closePopup.onclick=setup;

setup();
