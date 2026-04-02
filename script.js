const terminal = document.getElementById("terminal");
const input = document.getElementById("input");
const traceText = document.getElementById("trace");
const progress = document.getElementById("progress");

// Game state variables
let trace = 0;
let traceTimer;
let panicTimer;
let hacking = false;
let enemyGuessing = false;
let breachInProgress = false;

let playerPassword = "";
let enemyGuessIndex = 0;
let enemyCurrentGuess = "";

// Config
const passwordOptions = ["CYRITO", "HACKER", "FIREWALL", "ADMIN", "SECURE"];
const breachPuzzles = [
  { prompt: "Fix the code: console.log('FIREWALL BREACHED')", solution: "console.log('FIREWALL BREACHED');" },
  { prompt: "Fix this: let x = 5\nlet y = 10\nconsole.log(x+y)", solution: "let x = 5; let y = 10; console.log(x+y);" },
];

// --- UTILITY FUNCTIONS ---
function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

function scrollTerminal() { terminal.scrollTop = terminal.scrollHeight; }

function type(text, speed = 20) {
  return new Promise(resolve => {
    let i = 0;
    const line = document.createElement("div");
    terminal.appendChild(line);

    function typing() {
      if (i < text.length) {
        line.innerHTML += text[i++];
        setTimeout(typing, speed);
      } else {
        scrollTerminal();
        resolve();
      }
    }
    typing();
  });
}

// --- TRACE FUNCTIONS ---
function updateTrace(amount) {
  trace += amount;
  trace = Math.min(100, Math.max(0, trace));
  traceText.innerText = trace + "%";
  progress.style.width = trace + "%";

  if (trace >= 100 && !enemyGuessing) startEnemyGuessing();
}

function startTraceTimers() {
  clearInterval(traceTimer);
  clearInterval(panicTimer);

  traceTimer = setInterval(() => updateTrace(2), 2000);

  panicTimer = setInterval(() => {
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

// --- ENEMY GUESSING ---
async function startEnemyGuessing() {
  enemyGuessing = true;
  hacking = false;
  clearInterval(traceTimer);
  clearInterval(panicTimer);
  await type("\n!!! TRACE COMPLETE — ENEMY HACKER STARTS GUESSING !!!\n");

  enemyGuessIndex = 0;
  enemyCurrentGuess = "";

  while (enemyGuessIndex < playerPassword.length) {
    const guessChar = playerPassword[enemyGuessIndex];
    enemyCurrentGuess += guessChar;

    const hint = getHint(enemyCurrentGuess);
    await type(`Enemy guess: ${enemyCurrentGuess}  Hint: ${hint}`);

    enemyGuessIndex++;

    if (enemyCurrentGuess === playerPassword) {
      await type("\n!!! ENEMY HACKER SUCCESS — PASSWORD COMPROMISED !!!");
      await type("GAME OVER — RELOAD TO TRY AGAIN");
      input.disabled = true;
      return;
    }

    await sleep(1500);
  }
}

function getHint(guess) {
  let result = "";
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === playerPassword[i]) result += "✔ ";
    else if (playerPassword.includes(guess[i])) result += "~ ";
    else result += "✖ ";
  }
  return result;
}

// --- PASSWORD SELECTION ---
async function selectPassword() {
  await type("Select your password to protect your system:");
  passwordOptions.forEach((pw, i) => type(`${i + 1}: ${pw}`));
  await type("Type the number of your choice:");

  while (!playerPassword) {
    const choice = await promptInput();
    const num = Number(choice);
    if (num >= 1 && num <= passwordOptions.length) {
      playerPassword = passwordOptions[num - 1];
      await type(`Password set to: ${playerPassword}`);
    } else {
      await type("Invalid choice. Try again:");
    }
  }
}

// --- PROMPT INPUT ---
function promptInput() {
  return new Promise(resolve => {
    function enterHandler(e) {
      if (e.key === "Enter") {
        const val = input.value.trim();
        input.value = "";
        terminal.innerHTML += "> " + val + "<br>";
        input.removeEventListener("keydown", enterHandler);
        resolve(val);
      }
    }
    input.addEventListener("keydown", enterHandler);
  });
}

// --- COMMAND HANDLING ---
async function handleCommand(cmd) {
  if (enemyGuessing) {
    if (cmd === "FIREWALL") {
      await startFirewall();
    } else {
      await type("Enemy is guessing your password! Type 'FIREWALL' to temporarily stop them.");
    }
    return;
  }

  if (breachInProgress) {
    await handleBreachInput(cmd);
    return;
  }

  switch (cmd) {
    case "HELP":
      await type("Commands: HELP, SCAN, FIREWALL");
      break;
    case "SCAN":
      await type("Scanning target...");
      await type("Open ports found. Vulnerability detected.");
      updateTrace(5);
      break;
    case "FIREWALL":
      await startFirewall();
      break;
    default:
      await type("Unknown command.");
  }
}

// --- FIREWALL MINI-GAME ---
async function startFirewall() {
  breachInProgress = true;
  hacking = true;
  clearInterval(traceTimer);
  clearInterval(panicTimer);

  const puzzle = breachPuzzles[Math.floor(Math.random() * breachPuzzles.length)];
  await type("FIREWALL ENGAGED — Solve the puzzle to delete enemy memory!");
  await type(puzzle.prompt);
  await type("Type the corrected code:");
}

async function handleBreachInput(inputText) {
  const puzzle = breachPuzzles.find(p => inputText.trim() === p.solution);
  if (puzzle) {
    await type("Memory deleted — Trace reset. Enemy stopped!");
    trace = 0;
    updateTrace(0);
    breachInProgress = false;
    hacking = false;
    enemyGuessing = false;
    startTraceTimers();
  } else {
    await type("Incorrect code. Try again!");
    updateTrace(10);
  }
}

// --- BOOT SEQUENCE ---
async function boot() {
  await type("Booting CYRITO.exe...");
  await type("[OK] Core modules loaded");
  await type("[OK] Trace system active");
  await selectPassword();
  await type("Type 'HELP' to begin. Warning: Enemy hacker may trace you!");
  startTraceTimers();
}

// --- EVENT LISTENER ---
input.addEventListener("keydown", async e => {
  if (e.key === "Enter") {
    const cmd = input.value.trim().toUpperCase();
    if (!cmd) return;
    await handleCommand(cmd);
  }
});

// --- START ---
boot();
