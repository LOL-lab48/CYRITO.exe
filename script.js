// ==========================
// CYRITO 5.3 – Ultimate Hacker Horror
// Full immersion, all features included
// ==========================

// --- DOM REFERENCES ---
const terminal = document.getElementById("terminal");
const input = document.getElementById("input");
const traceText = document.getElementById("trace");
const progress = document.getElementById("progress");

// --- GAME STATE ---
let trace=0,traceTimer,panicTimer,hacking=false,breachInProgress=false,endMissionStarted=false;
let secretEndingFound=false,credentialsSubmitted=false,earlyRevealTriggered=false;
let currentMission=0,playerPassword="",virusCreated=[],repeatedInputs={},suspicion=0;

// --- MISSION DATA ---
let missions=[
{name:"INITIAL BREACH",objectives:["SCAN target system","UPLOAD payload"],completed:false},
{name:"DEEP SYSTEM ACCESS",objectives:["ENTER CREDENTIALS","OVERRIDE SECURITY"],completed:false},
{name:"VIRUS ASSEMBLY",objectives:["VIRUS component 1","VIRUS component 2","VIRUS component 3","VIRUS component 4","VIRUS component 5"],completed:false},
{name:"DECRYPT LOGS",objectives:["DECRYPT logs"],completed:false},
{name:"FINAL UPLOAD",objectives:["UPLOAD virus"],completed:false}];

// --- COMMANDS ---
const visibleCommands=["HELP","SCAN","FIREWALL","UPLOAD","DOWNLOAD","TRACE","ENCRYPT","OVERRIDE","PORTSCAN","BREACH","VIRUS","DECRYPT","CREDENTIALS","HINT"];
const secretCommands=["DECRYPT","TROJAN","SNIFFER","VIRUS","CYBERBOMB","MEMORYWIPE","NETWORKMAP","BACKDOOR","OVERCLOCK","OVERRIDECORE","SNIPER","HACKTOOL"];
const ultraSecretCommands=["OMEGA_END","CYBERSTORM","FBI_OPEN_UP"];

// --- FLAVOR RESPONSES ---
const flavorResponses=[
"Do you trust your instincts?","I am watching everything...","Are you certain about this approach?","Curious move, human.","Analyzing probabilities...",
"Execution patterns indicate high risk.","This action may trigger unintended consequences.","Interesting. Continue monitoring.","Hacking patterns observed. Proceed carefully.",
"Adaptive logic online. Input interpreted.","Your logic sequence is noted.","Calculating your next potential moves...","Pattern anomaly detected.","Observing behavioral trends...",
"System latency minimal, continue.","Warning: unauthorized curiosity detected.","Fascinating choice of command.","Analyzing risk versus reward...","Recommendation: proceed cautiously.",
"Input sequence logged.","Observing keystroke patterns.","System integrity check complete.","Data packet analysis ongoing.","Latency metrics within expected parameters.",
"Intrusion detection bypass probability: 72%.","Command evaluation in progress...","System response time optimal.","Behavioral anomalies detected.","Network packets are being analyzed.",
"Predictive analysis online.","Firewall vectors detected.","Potential exploit identified.","Trace level nominal.","System cores active and responsive.",
"Auxiliary modules online.","Executing background monitoring...","Command frequency noted.","Input recognized, pattern stored.","Analyzing environmental variables...",
"Syntax check complete.","Memory buffers stable.","Processing sequence queued.","Virtual node synchronization complete.","Encrypted channels nominal.",
"Packet loss minimal, continue.","Subsystems nominal.","Integrity verification in progress.","Latency spikes detected.","Re-routing network nodes...",
"Debug logs indicate anomalies.","Command recognized as potential threat vector.","Analyzing behavioral signature...","Micro-puzzle detected, optional hint available.","Operational parameters within tolerance.",
"Observing repeat patterns in input...","User shows exploratory behavior.","Decision tree adjusted dynamically.","Mission objectives logged and active.","System modules operating nominally.",
"Cybersecurity protocols intact.","Firewall routines online.","Virus assembly integrity check complete.","Micro-task sequence active.","Auxiliary feedback loop engaged.",
"Adaptive heuristics engaged.","Analyzing operational probabilities...","Command pattern logged.","User input analyzed for anomalies.","Potential security compromise detected.",
"Mission progress logged.","Observing player decision trends.","Behavioral pattern stored for analysis.","Predictive modeling complete.","Micro-puzzle hint available upon request.",
"Sequence alignment nominal.","System resources stable.","Logging all activity for monitoring.","Trace detection probability minimal.","Observing input frequency.",
"Analyzing environmental system responses.","Operational vectors within normal range.","Command sequence evaluation complete.","Auxiliary modules reporting active.","Firewall status optimal.",
"Behavioral analysis continues...","User attempting creative input.","Monitoring for hidden commands.","Predictive input modeling engaged.","System diagnostic complete.",
"Command processing time: 0.02s","Adaptive learning module online.","Cybernetic feedback loop active.","Virtual environment stable.","Mission subroutines monitored.",
"System integrity check passed.","Debugging modules online.","Input frequency exceeds expected parameters.","Optional micro-puzzle detected.","Easter egg potential noted.",
"Observation logs updated.","Analyzing probabilistic outcomes.","Command influence recorded.","Adaptive modules adjusting.","Pattern recognition engaged.",
"System integrity verified.","Monitoring trace progression.","Security vectors active.","Predictive algorithms running.","Auxiliary monitoring online.",
"Command accepted and logged.","Input recognized as unique pattern.","System performance optimal.","Firewall testing sequence complete.","Virus integrity verification active.",
"Memory buffers verified.","Subsystem response times normal.","Micro-task progression logged.","Observing input repetition.","AI core operational.",
"User appears cautious.","Behavioral heuristics adjusted.","Command sequence evaluated.","Trace analysis active.","Environmental scanning complete.",
"Virtual nodes synchronized.","Auxiliary routines operational.","Mission objectives verified.","Optional hints available.","Input patterns stored for future reference.",
"Micro-puzzle completion monitored.","System feedback received.","Predictive models updated.","Operational probabilities calculated.","Adaptive AI fully engaged."
// expand to 500+ flavor lines if desired
];

// --- UTILITY FUNCTIONS ---
function sleep(ms){return new Promise(r=>setTimeout(r,ms));}
function scrollTerminal(){terminal.scrollTop = terminal.scrollHeight;}
function randomChoice(arr){return arr[Math.floor(Math.random()*arr.length)];}

async function type(text,speed=20){
    return new Promise(resolve=>{
        let i=0;
        const line=document.createElement("div");
        terminal.appendChild(line);
        function typing(){if(i<text.length){line.innerHTML+=text[i++];setTimeout(typing,speed);}else{scrollTerminal();resolve();}}
        typing();
    });
}

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

// --- TRACE SYSTEM ---
function updateTrace(amount){
    trace=Math.min(100,Math.max(0,trace+amount));
    traceText.innerText=trace+"%";
    progress.style.width=trace+"%";
    if(trace>=100){finalBetrayalCinematic();}
}

function startTraceTimers(){
    clearInterval(traceTimer);clearInterval(panicTimer);
    traceTimer=setInterval(()=>updateTrace(1),4000);
    panicTimer=setInterval(async ()=>{
        if(!hacking) return;
        if(Math.random()<0.18){
            const spike=Math.floor(Math.random()*6);
            updateTrace(spike);
            terminal.classList.add("glitch");
            setTimeout(()=>terminal.classList.remove("glitch"),300);
            await type("! TRACE DETECTED !",30);
        }
    },9000);
}

// --- PASSWORD SELECTION ---
const passwordLength=7;
const allowedChars="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
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

// --- MINI-GAMES ---
const firewallLinesPool=["system.mem[0] = ???","var x = 10","console.log('ACCESS')","let y = 5","data.push(0)","fetch('/data')","if(flag){doSomething()}","var password = '?????'","memory.clear()","trace.reset()","function hack(){return true}","let z = x + y"];
const virusParts=["Injector","Sniffer","Trojan","Keylogger","Worm","PacketBomb","Rootkit","Backdoor"];

async function startFirewall(){
    breachInProgress=true; hacking=true; clearInterval(traceTimer); clearInterval(panicTimer);
    await type("FIREWALL ENGAGED — Choose action: BYPASS / FORCE / WAIT");
    const lines=[...firewallLinesPool].sort(()=>0.5-Math.random()).slice(0,4);
    for(const line of lines){
        await type(line);
        let solved=false;
        while(!solved){
            const inputText=await promptInput();
            if(["BYPASS","FORCE","WAIT"].includes(inputText.toUpperCase())){
                solved=true;
                await type(`Action ${inputText.toUpperCase()} executed.`);
                updateTrace(inputText.toUpperCase()==="FORCE"?5:-2);
            } else await type("Invalid option. Try BYPASS, FORCE, or WAIT.");
        }
    }
    breachInProgress=false; hacking=false;
    startTraceTimers();
}

async function assembleVirus(){
    if(!endMissionStarted) return;
    const part=virusParts[Math.floor(Math.random()*virusParts.length)];
    virusCreated.push(part);
    await type(`Virus component assembled: ${part}`);
    await type(`Components assembled: ${virusCreated.length}/5`);
    checkMission("VIRUS component "+virusCreated.length);
}

async function askCredentials(){
    credentialsSubmitted=true;
    await type("[CRYITO]: Please enter your credentials for verification:");
    const creds=await promptInput();
    await type("[CRYITO]: Credentials accepted.");
}

// --- DYNAMIC AI ---
async function dynamicAI(cmd){
    if(!repeatedInputs[cmd]){repeatedInputs[cmd]=0;} repeatedInputs[cmd]++;
    let response=randomChoice(flavorResponses);
    if(repeatedInputs[cmd]>2){response="You are predictable… CRYITO notices."; suspicion+=1;}
    await type("[CRYITO]: "+response);
}

// --- COMMAND HANDLER ---
async function handleCommand(cmd){
    const normalized=cmd.toUpperCase().replace(/[^A-Z_0-9]/g,'');
    switch(normalized){
        case "HELP": await type("Visible commands: "+visibleCommands.join(", ")); break;
        case "SCAN": await type("Scanning target system… Open ports: 22,80,443…"); updateTrace(1); checkMission("SCAN target system"); break;
        case "UPLOAD": await type("Upload executed."); updateTrace(1); checkMission("UPLOAD payload"); break;
        case "DOWNLOAD": await type("Download complete."); break;
        case "TRACE": await type(`Current trace: ${trace}%`); break;
        case "ENCRYPT": await type("Encrypting… Trace -1%"); updateTrace(-1); break;
        case "OVERRIDE": await type("Override executed."); checkMission("OVERRIDE SECURITY"); break;
        case "PORTSCAN": await type("Port scan complete. Trace +2%"); updateTrace(2); break;
        case "BREACH": await startEndMission(); break;
        case "FIREWALL": await startFirewall(); break;
        case "VIRUS": await assembleVirus(); break;
        case "DECRYPT": await type("Decrypting logs… Done."); checkMission("DECRYPT logs"); break;
        case "CREDENTIALS": await askCredentials(); checkMission("ENTER CREDENTIALS"); break;
        case "OMEGA_END":
        case "CYBERSTORM": virusCreated=[...virusParts]; await type("[CRYITO]: Ultra-secret command activated! Chaos mode!"); break;
        case "FBI_OPEN_UP": await type("[CRYITO]: 🚨 FBI OPEN UP! 🚨"); break;
        default: await dynamicAI(cmd); break;
    }
}

// --- MISSION HANDLER ---
async function checkMission(objective){
    if(currentMission>=missions.length) return;
    const mission=missions[currentMission];
    const index=mission.objectives.indexOf(objective);
    if(index!==-1){
        mission.objectives.splice(index,1);
        await type(`[MISSION]: Objective completed: ${objective}`);
        if(mission.objectives.length===0){
            mission.completed=true;
            currentMission++;
            if(currentMission<missions.length){await type(`[MISSION]: Next mission: ${missions[currentMission].name}`);}
            else{await startEndMission();}
        }
    }
}

// --- END MISSION + FINAL BETRAYAL ---
async function startEndMission(){endMissionStarted=true; hacking=true; startTraceTimers(); await type("\n=== END MISSION INITIATED ==="); await type("Assemble virus, bypass firewall, decrypt logs…");}

// --- FINAL BETRAYAL CINEMATIC ---
async function finalBetrayalCinematic(){
    terminal.classList.add("glitch");
    await type("[CRYITO]: ALERT! TRACE LEVEL MAXED!"); await sleep(500);
    await type("[CRYITO]: Your hacking activity has been traced to your location..."); await sleep(800);
    await type("[CRYITO]: Authorities are monitoring your session."); await sleep(1000);
    for(let i=0;i<5;i++){terminal.innerHTML+=randomChoice(["!!!SYSTEM FAILURE!!!","### MEMORY CORRUPTION ###","!!! TRACE OVERLOAD !!!"])+"<br>";await sleep(200);}
    await type("[CRYITO]: 🚨 STEP AWAY FROM THE COMPUTER! 🚨",50); await sleep(500);
    await type("[CRYITO]: Authorized by the Australian Federal Police (AFP).",50); await sleep(700);
    await type("[CRYITO]: You are surrounded. Leave your terminal. Hands visible at all times.",50); await sleep(700);
    await type("[CRYITO]: Session terminated. All actions reported.",50); await sleep(500);

    // Red screen overlay
    const warningDiv=document.createElement("div"); warningDiv.style.position="fixed"; warningDiv.style.top="0"; warningDiv.style.left="0";
    warningDiv.style.width="100%"; warningDiv.style.height="100%"; warningDiv.style.backgroundColor="red";
    warningDiv.style.color="white"; warningDiv.style.fontSize="36px"; warningDiv.style.fontWeight="bold";
    warningDiv.style.textAlign="center"; warningDiv.style.display="flex"; warningDiv.style.flexDirection="column";
    warningDiv.style.justifyContent="center"; warningDiv.style.alignItems="center";
    warningDiv.innerHTML="⚠️ WARNING! ⚠️<br>STEP AWAY FROM THE COMPUTER!<br>AUTHORIZED BY THE AFP";
    document.body.appendChild(warningDiv);

    // Terminal glitches behind overlay
    for(let i=0;i<20;i++){terminal.innerHTML+=randomChoice(["!!!ERROR!!!","### CRITICAL FAILURE ###","!!! TRACE SPIKE !!!"])+"<br>"; terminal.scrollTop=terminal.scrollHeight; await sleep(150);}

    await type("[CRYITO]: If you survive… CRYITO #2: Avenge the Fallen → https://lol-lab48.github.io/CYRITO#2-Avenge-the-Fallen/",50);
    input.disabled=true;
}

// --- EVENT LISTENER ---
input.addEventListener("keydown",async e=>{if(e.key==="Enter"){const cmd=input.value.trim();if(!cmd)return;await handleCommand(cmd);}});

// --- BOOT SEQUENCE ---
async function boot(){await type("Booting CRYITO...");await type("[OK] Core modules loaded");await type("[OK] Trace system active");await selectPassword();await type("Type 'HELP' to begin. Focus on mission objectives!");startTraceTimers();}

// --- START GAME ---
boot();
