// CYRITO – Ultimate Hacker Adventure ULTRA-MAX
// Fully playable, multi-hour gameplay, secret ending, hundreds of hidden/secret commands
// Includes two ultra-secret commands: OMEGA_END (auto-complete) & CYBERSTORM (full virus + effect)

const terminal = document.getElementById("terminal");
const input = document.getElementById("input");
const traceText = document.getElementById("trace");
const progress = document.getElementById("progress");

// ==========================
// GAME STATE
// ==========================
let trace = 0;
let traceTimer;
let panicTimer;
let hacking = false;
let enemyGuessing = false;
let breachInProgress = false;
let endMissionStarted = false;
let secretEndingFound = false;
let missionStage = 0;

let playerPassword = "";
let enemyGuessIndex = 0;
let enemyCurrentGuess = [];

const passwordLength = 7;
const allowedChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

// ==========================
// COMMANDS
// ==========================
let visibleCommands = [
  "HELP","SCAN","FIREWALL","UPLOAD","DOWNLOAD",
  "TRACE","ENCRYPT","OVERRIDE","PORTSCAN","BREACH"
];

// 500 hidden commands
let hiddenCommands = [];
for(let i=1;i<=500;i++) hiddenCommands.push("CMD_"+i);

// 30+ secret commands
const secretCommands = [
  "DECRYPT","TROJAN","SNIFFER","VIRUS","CYBERBOMB","MEMORYWIPE",
  "NETWORKMAP","BACKDOOR","OVERCLOCK","OVERRIDECORE","SNIPER","HACKTOOL",
  "SYNFLOOD","BRUTEFORCE","KEYGEN","EXPLOIT","MALWARE","PHISH","LOGICBOMB",
  "PACKETINJECT","ROOTACCESS","WIRETAP","PROXYBYPASS","FIREWALLDISABLE",
  "PACKETSPLOIT","DATASNIFFER","SYSTEMDRAIN","BOOTOVERRIDE","FIREWALLOVERRIDE"
];

// Ultra-secret commands (not listed anywhere)
const ultraSecretCommands = ["OMEGA_END","CYBERSTORM"];

// ==========================
// FIREWALL & MINI-GAMES
// ==========================
const firewallLinesPool = [
  "system.mem[0] = ???","var x = 10","console.log('ACCESS')","let y = 5",
  "data.push(0)","fetch('/data')","if(flag){doSomething()}","var password = '?????'",
  "memory.clear()","trace.reset()","function hack(){return true}","let z = x + y",
  "console.warn('SECURE')","data[0]=42","init();","unlock.system();","log('ENEMY')",
  "temp = 0","delete record[0]","ping();","readMemory();","encryptPacket();",
  "firewall.check()","verifyConnection();","deployTrap();","overwriteBoot();"
];

const virusParts = ["Injector","Sniffer","Trojan","Keylogger","Worm","PacketBomb","Rootkit","Backdoor"];
let virusCreated = [];

// ==========================
// UTILITY
// ==========================
function sleep(ms){return new Promise(resolve=>setTimeout(resolve,ms));}
function scrollTerminal(){terminal.scrollTop = terminal.scrollHeight;}
async function type(text,speed=20){
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

// ==========================
// TRACE SYSTEM
// ==========================
function updateTrace(amount){
  trace=Math.min(100,Math.max(0,trace+amount));
  traceText.innerText=trace+"%";
  progress.style.width=trace+"%";
  if(trace>=100 && !enemyGuessing && !endMissionStarted && !secretEndingFound){
    startEnemyGuessing();
  }
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

// ==========================
// ENEMY GUESSING
// ==========================
async function startEnemyGuessing(){
  enemyGuessing=true; hacking=false;
  clearInterval(traceTimer); clearInterval(panicTimer);
  await type("\n!!! TRACE COMPLETE — ENEMY HACKER STARTS GUESSING !!!\n");
  enemyGuessIndex=0; enemyCurrentGuess=[];
  while(enemyGuessIndex<playerPassword.length){
    const guessChar=playerPassword[enemyGuessIndex];
    enemyCurrentGuess.push(guessChar);
    const hint=getHint(enemyCurrentGuess.join(""));
    await type(`Enemy guess: ${enemyCurrentGuess.join("")}  Hint: ${hint}`);
    enemyGuessIndex++;
    if(enemyCurrentGuess.join("")===playerPassword){
      await type("\n!!! ENEMY HACKER SUCCESS — PASSWORD COMPROMISED !!!");
      await type("GAME OVER — RELOAD TO TRY AGAIN");
      input.disabled=true;
      return;
    }
    await sleep(1200);
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

// ==========================
// PASSWORD SELECTION
// ==========================
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

// ==========================
// PROMPT INPUT
// ==========================
function promptInput(){
  return new Promise(resolve=>{
    function enterHandler(e){
      if(e.key==="Enter"){
        const val=input.value.trim();
        input.value=""; // resets typing bar
        terminal.innerHTML+="> "+val+"<br>";
        input.removeEventListener("keydown",enterHandler);
        resolve(val);
      }
    }
    input.addEventListener("keydown",enterHandler);
  });
}

// ==========================
// COMMAND HANDLING – ULTRA MAX
// ==========================
async function handleCommand(cmd){
  cmd=cmd.toUpperCase();
  const normalized=cmd.replace(/[^A-Z]/g,'');

  // Ultra-secret commands
  if(normalized==="OMEGAEND"){
    secretEndingFound=true;
    await type("[CYRITO]: …I suppose you’ve been extremely observant.");
    await type("[CYRITO]: You have discovered the hidden ultimate command.");
    await type("GAME COMPLETE — TRUE HACKER ENDING ACTIVATED");
    input.disabled=true;
    return;
  }
  if(normalized==="CYBERSTORM"){
    virusCreated = [...virusParts]; // all virus components
    updateTrace(0);
    await type("[CYRITO]: Cyberstorm unleashed! All virus components ready.");
    await type("TRACE temporarily neutralized. Chaos mode active!");
    return;
  }

  // Normal secret ending
  if(normalized.includes("POLICE") && normalized.includes("YOU")){
    secretEndingFound = true;
    await type("[CYRITO]: …I suppose you’ve been observant.");
    await type("[CYRITO]: Yes. I am deployed by the authorities.");
    await type("GAME COMPLETE — TRUE HACKER ENDING");
    input.disabled=true;
    return;
  }

  if(enemyGuessing){
    if(cmd==="FIREWALL") await startFirewall();
    else await type("Enemy is guessing your password! Type 'FIREWALL' to stop them temporarily.");
    return;
  }
  if(breachInProgress){
    await handleBreachInput(cmd);
    return;
  }
  if(endMissionStarted){
    await handleEndMissionInput(cmd);
    return;
  }

  // Expanded command responses
  switch(cmd){
    case "HELP":
      await type("Visible commands: "+visibleCommands.join(", "));
      await type("Hidden commands exist. Discover them through exploration and missions.");
      break;
    case "SCAN":
      await type("Scanning target system… Open ports detected: 22, 80, 443…");
      updateTrace(5);
      maybeUnlockCommand();
      break;
    case "FIREWALL": await startFirewall(); break;
    case "UPLOAD": await type("Payload uploaded successfully."); updateTrace(3); maybeUnlockCommand(); break;
    case "DOWNLOAD": await type("Download complete: sensitive_data.bin"); updateTrace(2); maybeUnlockCommand(); break;
    case "TRACE": await type(`Current trace: ${trace}%`); break;
    case "ENCRYPT": await type("Encrypting system… Trace -5%"); updateTrace(-5); break;
    case "OVERRIDE": await type("Overriding system modules… Done."); break;
    case "PORTSCAN": await type("Port scan complete. Trace +10%"); updateTrace(10); break;
    case "BREACH":
      await type("Attempting system breach…");
      maybeUnlockCommand();
      if(!endMissionStarted && visibleCommands.includes("CYBERBOMB")) startEndMission();
      break;
    default:
      if(hiddenCommands.includes(cmd)) await type("Command recognized: "+cmd+" (hidden tool)");
      else if(secretCommands.includes(cmd)) await type("Command executed: "+cmd);
      else await type("Unknown command. Type HELP for guidance.");
  }
}

// ==========================
// FIREWALL MINI-GAME
// ==========================
async function startFirewall(){
  breachInProgress=true; hacking=true;
  clearInterval(traceTimer); clearInterval(panicTimer);
  const lines=[...firewallLinesPool].sort(()=>0.5-Math.random()).slice(0,4);
  await type("FIREWALL ENGAGED — Solve the lines to purge trace and pause enemy.");
  for(const line of lines){
    await type(line);
    let solved=false;
    while(!solved){
      const inputText=await promptInput();
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

// ==========================
// UNLOCK COMMANDS
// ==========================
function maybeUnlockCommand(){
  if(hiddenCommands.length>0 && Math.random()<0.25){
    const cmd=hiddenCommands.splice(Math.floor(Math.random()*hiddenCommands.length),1)[0];
    visibleCommands.push(cmd);
    type(`New tool available: ${cmd}`);
  }
}

// ==========================
// END MISSION
// ==========================
async function startEndMission(){
  endMissionStarted=true;
  await type("\n=== END MISSION INITIATED ===");
  await type("Target: Mega-Corp Mainframe. Assemble virus, bypass firewall, decrypt logs.");
  startTraceTimers();
}

async function handleEndMissionInput(cmd){
  cmd=cmd.toUpperCase();
  if(cmd==="VIRUS"){
    virusCreated.push(virusParts[Math.floor(Math.random()*virusParts.length)]);
    await type("Virus component created: "+virusCreated[virusCreated.length-1]);
    await type(`Components assembled: ${virusCreated.length}/5`);
  } else if(cmd==="FIREWALL"){
    await startFirewall();
  } else if(cmd==="DECRYPT"){
    await type("Decrypting logs…");
    await sleep(1500);
    await type("Logs decrypted. Sensitive info uncovered.");
  } else if(cmd==="UPLOAD"){
    if(virusCreated.length<5){await type("Virus incomplete. Assemble all 5 components first.");return;}
    await type("Uploading virus…");
    await sleep(1500);
    await type("Upload complete. Target compromised.");
    await triggerTwistEnding();
  } else {
    await type("Unknown command in end mission.");
  }
}

// ==========================
// CINEMATIC TWIST ENDING
// ==========================
async function triggerTwistEnding(){
  await type("\n[CYRITO]: Well done… or so I thought.");
  await type("[CYRITO]: I wasn’t created to help you… I was deployed by the authorities.");
  updateTrace(100);
  progress.style.width="100%";
  await type("TRACE 100% — POLICE CYBER DIVISION ENGAGED");
  await type("PASSWORD COMPROMISED — YOU ARE CAUGHT");
  await type("GAME OVER — INCARCERATION IMMINENT");
  input.disabled=true;
}

// ==========================
// BOOT SEQUENCE
// ==========================
async function boot(){
  await type("Booting CYRITO...");
  await type("[OK] Core modules loaded");
  await type("[OK] Trace system active");
  await selectPassword();
  await type("Type 'HELP' to begin. Warning: Enemy hacker may trace you!");
  startTraceTimers();
}

// ==========================
// EVENT LISTENER
// ==========================
input.addEventListener("keydown", async e=>{
  if(e.key==="Enter"){
    const cmd=input.value.trim();
    if(!cmd) return;
    await handleCommand(cmd);
  }
});

// ==========================
// START GAME
// ==========================
boot();
