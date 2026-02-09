const screens={
  instruction:document.getElementById("instruction"),
  game:document.getElementById("game"),
  result:document.getElementById("result")
};

const grid=document.getElementById("grid");
const roundText=document.getElementById("roundText");
const timerText=document.getElementById("timer");
const msg=document.getElementById("msg");

let pattern=[];
let user=[];
let round=1;
let score=0;
let canClick=false;
const maxRounds=5;

/* Create grid */
for(let i=0;i<16;i++){
  let d=document.createElement("div");
  d.className="cell";
  d.dataset.index=i;

  d.onclick=()=>{
    if(!canClick) return;

    d.classList.toggle("select");
    let idx=parseInt(d.dataset.index);

    if(user.includes(idx)) user=user.filter(x=>x!==idx);
    else user.push(idx);
  };

  grid.appendChild(d);
}

function showScreen(name){
  for(let s in screens) screens[s].classList.remove("active");
  screens[name].classList.add("active");
}

/* Start Round */
function startRound(){
  showScreen("game");
  msg.innerText="";
  user=[];
  pattern=[];
  clearGrid();
  canClick=false;

  roundText.innerText="Round "+round+" / "+maxRounds;

  let available=[...Array(16).keys()];
  pattern=[...getChunk(available,3), ...getChunk(available,2)];

  pattern.forEach(i=>grid.children[i].classList.add("show"));

  startTimer(5);
}

function getChunk(arr,size){
  let c=[];
  for(let i=0;i<size;i++){
    let r=Math.floor(Math.random()*arr.length);
    c.push(arr[r]);
    arr.splice(r,1);
  }
  return c;
}

/* Timer with decreasing bar */
function startTimer(t){
  const progress=document.getElementById("progress");
  progress.style.width="100%";
  timerText.innerText="Time: "+t;
  let total=t;

  let x=setInterval(()=>{
    t--;
    timerText.innerText="Time: "+t;
    progress.style.width=(t/total)*100+"%";

    if(t===0){
      clearInterval(x);
      pattern.forEach(i=>grid.children[i].classList.remove("show"));
      canClick=true;
    }
  },1000);
}

/* Submit */
function submitAnswer(){
  if(!canClick) return;

  pattern.sort();
  user.sort();

  if(JSON.stringify(pattern)===JSON.stringify(user)){
    score++;
    msg.innerText="Correct";
  }else{
    msg.innerText="Wrong";
  }

  round++;
  pattern=[];
  canClick=false;

  if(round>maxRounds){
    endGame();
  }else{
    setTimeout(startRound,1000);
  }
}

function endGame(){
  showScreen("result");
  document.getElementById("finalScore").innerText=score+" / "+maxRounds;
}

function clearGrid(){
  for(let c of grid.children){
    c.classList.remove("show");
    c.classList.remove("select");
  }
}
