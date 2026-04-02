const terminal = document.getElementById("terminal");
const input = document.getElementById("input");
const traceText = document.getElementById("trace");
const progress = document.getElementById("progress");

let level = Number(localStorage.getItem("level")) || 1;
let trace = 0;
let currentPassword = "";
let hacking = false;
let timer;
let panicInterval;
let eliteMode = false;
let currentMissionIndex = 0;

// Missions with targets and passwords for each level
const missions = [
  { target: "SERVER-ALPHA", passwords: ["ACCESS", "LOGIN", "ADMIN"] },
  { target: "NODE-BETA", passwords: ["X9P3L", "Z4K8M", "Q7R2N"] },
  { target: "CORE-GAMMA", passwords: ["ELITE", "CYRITO", "HACK3R"] },
];

// Fake code puzzles for elite mode
const elitePuzzles = [
  {
    prompt: "Fix the syntax to unlock:\nfunction hack() {\n  console.log('ACCESS GRANTED')\n}",
    solution: "function hack() { console.log('ACCESS GRANTED'); }",
  },
  {
    prompt: "Correct the variable:\nlet password = '1234'\npassword = '5678'",
    solution: "let password = '1234'; password = '5678';",
  },
];

// Typing effect for terminal text
function type(text, speed = 20) {
  return new Promise(resolve => {
    let i = 0;
    let line = document.createElement("div");
    terminal.appendChild(line);

    function typing() {
      if (i < text.length) {
        line.innerHTML += text[i];
        i++;
        setTimeout(typing, speed);
      } else {
        scroll();
        resolve();
      }
    }
    typing();
  });
}

// Scroll terminal to bottom
function scroll() {
  terminal.scrollTop = terminal.scrollHeight;
}

// Update trace bar & text
function updateTrace(amount) {
  trace += amount;
  if (trace > 100) trace = 100;

  traceText.innerText = trace + "%";
  progress.style.width = trace + "%";

  if (trace >= 100) {
    panic("!!! TRACE COMPLETE — ACCESS DENIED !!!");
    input.disabled = true;
    clearInterval(timer);
    clearInterval(panicInterval);
  }
}

// Start trace timer (pressure)
function startTimer() {
  timer = setInterval(() => {
    updateTrace(2);
  }, 2000);

  // Start random trace spikes (panic mode)
  panicInterval = setInterval(() => {
    if (!hacking) return;
    const spike = Math.random() < 0.3 ? Math.floor(Math.random() * 10) : 0;
    if (spike) {
      updateTrace(spike);
      terminal.classList.add("glitch");
      setTimeout(() => terminal.classList.remove("glitch"), 300);
      type("! TRACE DETECTED !", 30);
    }
  }, 7000);
}

// Choose password from current mission
function setPassword() {
  const mission = missions[currentMissionIndex];
  currentPassword =
    mission.passwords[Math.floor(Math.random() * mission.passwords.length)];
}

// Provide hints (Wordle-style)
function getHint(guess) {
  let result = "";
  for (let i = 0; i < currentPassword.length; i++) {
    if (guess[i] === currentPassword[i]) result += "✔ ";
    else if (currentPassword.includes(guess[i])) result += "~ ";
    else result += "✖ ";
  }
  return result;
}

// Handle elite mode fake coding puzzle
async function elitePuzzle() {
  eliteMode = true;
  clearInterval(timer);
  clearInterval(panicInterval);

  const puzzle = elitePuzzles[Math.floor(Math.random() * elitePuzzles.length)];
  await type("ELITE HACKER MODE ACTIVATED");
  await type("Solve this code puzzle to proceed:");
  await type(puzzle.prompt);

  while (true) {
    const answer = await promptUserInput();
    if (answer.trim() === puzzle.solution) {
      await type("PUZZLE SOLVED — ACCESS GRANTED ✅");
      eliteMode = false;
      hacking = false;
      trace = 0;
      updateTrace(0);
      currentMissionIndex++;
      if (currentMissionIndex >= missions.length) {
        await type("ALL MISSIONS COMPLETE. YOU WIN!");
        input.disabled = true;
      } else {
        await type("Next mission: " + missions[currentMissionIndex].target);
      }
      break;
    } else {
      await type("Incorrect solution. Try again.");
      updateTrace(10);
    }
  }
}

// Helper for awaiting user input in elite mode puzzles
function promptUserInput() {
  return new Promise(resolve => {
    function onEnter(e) {
      if (e.key === "Enter") {
        const val = input.value;
        input.value = "";
        terminal.innerHTML += "> " + val + "<br>";
        input.removeEventListener("keydown", onEnter);
        resolve(val);
      }
    }
    input.addEventListener("keydown", onEnter);
  });
}

// Command handler with all gameplay logic
async function handleCommand(cmd) {
  if (eliteMode) {
    // While in elite mode, input is handled by elitePuzzle()
    return;
  }

  if (cmd === "HELP") {
    await type("Commands: HELP, SCAN, BREACH");
  } 
  else if (cmd === "SCAN") {
    await type("Scanning target...");
    await type("Open ports found");
    await type("Vulnerability detected");
  } 
  else if (cmd === "BREACH") {
    hacking = true;
    setPassword();
    await type("Initiating breach on " + missions[currentMissionIndex].target + "...");
    await type("Enter password (" + currentPassword.length + " chars)");
    startTimer();
  } 
  else if (hacking) {
    if (cmd === currentPassword) {
      await type("ACCESS GRANTED ✅");
      hacking = false;
      clearInterval(timer);
      clearInterval(panicInterval);
      trace = 0;
      updateTrace(0);

      // Advance mission or go to elite puzzle
      currentMissionIndex++;
      if (currentMissionIndex < missions.length - 1) {
        await type("Mission complete. Next target: " + missions[currentMissionIndex].target);
      } else {
        await elitePuzzle();
      }
    } else {
      await type("ACCESS DENIED ❌");
      await type(getHint(cmd));
      updateTrace(15);
    }
  } 
  else {
    await type("Unknown command");
  }
  scroll();
}

// Listen for user input
input.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    const cmd = input.value.trim().toUpperCase();
    if (!cmd) return; // ignore empty
    terminal.innerHTML += "> " + cmd + "<br>";
    input.value = "";
    await handleCommand(cmd);
  }
});

// Boot sequence at start with typing effect
async function boot() {
  await type("Booting CYRITO.exe...");
  await type("[OK] Core modules loaded");
  await type("[OK] Trace system active");
  await type("Type 'HELP' to begin");
  await type("Mission: " + missions[currentMissionIndex].target);
  scroll();
  input.focus();
}

boot();
