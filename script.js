const terminal = document.getElementById("terminal");
const input = document.getElementById("input");
const traceText = document.getElementById("trace");
const progress = document.getElementById("progress");

// GAME STATE
let trace = 0;
let traceTimer;
let panicTimer;
let hacking = false;
let enemyGuessing = false;
let breachInProgress = false;

let playerPassword = "";
let enemyGuessIndex = 0;
let enemyCurrentGuess = "";

const passwordLength = 7;
const allowedChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

// COMMANDS
let visibleCommands = [
  "HELP","SCAN","FIREWALL","UPLOAD","DOWNLOAD",
  "TRACE","ENCRYPT","OVERRIDE","PORTSCAN","BREACH"
];

let hiddenCommands = [];
for(let i=0;i<100;i++) hiddenCommands.push("COMMAND_" + (i+1));

// FIREWALL LINES POOL
const firewallLinesPool = [
  "system.mem[0] = ???",
  "var x = 10",
  "console.log('ACCESS')",
  "let y = 5",
  "data.push(0)",
  "fetch('/data')",
  "if(flag){doSomething()}",
  "var password = '?????'",
  "memory.clear()",
  "trace.reset()",
  "function hack(){return true}",
  "let z = x + y",
  "console.warn('SECURE')",
  "data[0]=42",
  "init();",
  "unlock.system();",
  "log('ENEMY')",
  "temp = 0",
  "delete record[0]",
  "ping();"
];

// UTILITY
function sleep(ms){return new Promise(resolve=>setTimeout(resolve,ms));}
function scrollTerminal(){terminal.scrollTop = terminal.scrollHeight;}
function type(text,speed=20){
  return new Promise(resolve=>{
    let i=0;
    const line=document.createElement("div");
    terminal.appendChild(line);
    function typing(){
      if(i<text.length){line.innerHTML+=text[i++];setTimeout(typing,speed);}
      else{scrollTerminal();resolve();}
    }
    typing();
  });
}

// TRACE
function updateTrace(amount){
  trace=Math.min(100,Math.max(0,trace+amount));
  traceText.innerText=trace+"%";
  progress.style.width=trace+"%";
  if(trace>=100 && !enemyGuessing) startEnemyGuessing();
}

function startTraceTimers(){
  clearInterval(traceTimer); clearInterval(panicTimer);
  traceTimer=setInterval(()=>updateTrace(2),2000);
  panicTimer=setInterval(()=>{
    if(!hacking) return;
    const spike = Math.random()<0.3?Math.floor(Math.random()*10):0;
    if(spike){
      updateTrace(spike);
      terminal.classList.add("glitch");
      setTimeout(()=>terminal.classList.remove("glitch"),300);
      type("! TRACE DETECTED !",30);
    }
  },7000);
}

// ENEMY GUESSING
async function startEnemyGuessing(){
  enemyGuessing=true; hacking=false;
  clearInterval(traceTimer); clearInterval(panicTimer);
  await type("\n!!! TRACE COMPLETE — ENEMY HACKER STARTS GUESSING !!!\n");
  enemyGuessIndex=0; enemyCurrentGuess="";
  while(enemyGuessIndex<playerPassword.length){
    const guessChar=playerPassword[enemyGuessIndex];
    enemyCurrentGuess+=guessChar;
    const hint=getHint(enemyCurrentGuess);
    await type(`Enemy guess: ${enemyCurrentGuess}  Hint: ${hint}`);
    enemyGuessIndex++;
    if(enemyCurrentGuess===playerPassword){
      await type("\n!!! ENEMY HACKER SUCCESS — PASSWORD COMPROMISED !!!");
      await type("GAME OVER — RELOAD TO TRY AGAIN");
      input.disabled=true;
      return;
    }
    await sleep(1500);
  }
}

function getHint(guess){
  let result="";
  for(let i=0;i<guess.length;i++){
    if(guess[i]===playerPassword[i]) result+="✔ ";
    else if(playerPassword.includes(guess[i])) result+="~ ";
    else result+="✖ ";
  }
  return result;
}

// PASSWORD SELECTION
async function selectPassword(){
  await type(`Create your ${passwordLength}-character password (letters A-Z and numbers 0-9):`);
  while(!playerPassword){
    const choice=await promptInput();
    if(choice.length!==passwordLength){await type("Password must be exactly 7 characters.");continue;}
    if(![...choice.toUpperCase()].every(c=>allowedChars.includes(c))){await type("Only letters A-Z and numbers 0-9 allowed.");continue;}
    playerPassword=choice.toUpperCase();
    await type(`Password set to: ${playerPassword}`);
  }
}

// PROMPT INPUT
function promptInput(){
  return new Promise(resolve=>{
    function enterHandler(e){
      if(e.key==="Enter"){
        const val=input.value.trim();
        input.value="";
        terminal.innerHTML+="> "+val+"<br>";
        input.removeEventListener("keydown",enterHandler);
        resolve(val);
      }
    }
    input.addEventListener("keydown",enterHandler);
  });
}

// COMMAND HANDLING
async function handleCommand(cmd){
  cmd=cmd.toUpperCase();
  if(enemyGuessing){
    if(cmd==="FIREWALL") await startFirewall();
    else await type("Enemy is guessing your password! Type 'FIREWALL' to stop them temporarily.");
    return;
  }
  if(breachInProgress){
    await handleBreachInput(cmd);
    return;
  }
  switch(cmd){
    case "HELP":
      await type("Available commands: "+visibleCommands.join(", "));
      await type("WARNING: Additional commands exist. Unlock them as you explore the system.");
      break;
    case "SCAN":
      await type("Scanning target...");
      await type("Open ports found. Vulnerabilities detected.");
      updateTrace(5);
      maybeUnlockCommand();
      break;
    case "FIREWALL": await startFirewall(); break;
    case "UPLOAD": await type("Uploading malicious payload... Done."); updateTrace(3); maybeUnlockCommand(); break;
    case "DOWNLOAD": await type("Downloading secret files... Done."); updateTrace(2); maybeUnlockCommand(); break;
    case "TRACE": await type(`Current trace: ${trace}%`); break;
    case "ENCRYPT": await type("Encrypting local system... Trace reduced by 5%"); updateTrace(-5); break;
    case "OVERRIDE": await type("Overriding subsystem... Done."); break;
    case "PORTSCAN": await type("Scanning ports deeply... Trace +10%"); updateTrace(10); break;
    case "BREACH": await type("Attempting breach..."); updateTrace(5); maybeUnlockCommand(); break;
    default:
      if(hiddenCommands.includes(cmd)){
        await type("Command recognized: "+cmd);
      } else await type("Unknown command.");
  }
}

// FIREWALL MINI-GAME
async function startFirewall(){
  breachInProgress=true; hacking=true;
  clearInterval(traceTimer); clearInterval(panicTimer);
  const lines=[...firewallLinesPool].sort(()=>0.5-Math.random()).slice(0,3);
  await type("FIREWALL ENGAGED — Solve the lines to purge trace and pause enemy.");
  for(const line of lines){
    await type(line);
    let solved=false;
    while(!solved){
      const inputText=await promptInput();
      // simple hack: accept any non-empty input as “solved” for fun
      if(inputText.trim()!==""){
        await type("Line fixed! Trace slightly reduced.");
        updateTrace(-5);
        solved=true;
      } else await type("Try again!");
    }
  }
  trace=0; updateTrace(0);
  await type("SYSTEM MEMORY PURGED — TRACE RESET, ENEMY PAUSED");
  breachInProgress=false; hacking=false;
  startTraceTimers();
}

// UNLOCK RANDOM COMMANDS
function maybeUnlockCommand(){
  if(hiddenCommands.length>0 && Math.random()<0.2){
    const cmd=hiddenCommands.splice(Math.floor(Math.random()*hiddenCommands.length),1)[0];
    visibleCommands.push(cmd);
    type(`New tool available: ${cmd}`);
  }
}

// BOOT SEQUENCE
async function boot(){
  await type("Booting CYRITO.exe...");
  await type("[OK] Core modules loaded");
  await type("[OK] Trace system active");
  await selectPassword();
  await type("Type 'HELP' to begin. Warning: Enemy hacker may trace you!");
  startTraceTimers();
}

// EVENT LISTENER
input.addEventListener("keydown", async e=>{
  if(e.key==="Enter"){
    const cmd=input.value.trim();
    if(!cmd) return;
    await handleCommand(cmd);
  }
});

// START GAME
boot();
