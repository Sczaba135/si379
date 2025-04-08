
let tasks = JSON.parse(localStorage.getItem('lemonTasks')) || [];
let currentTaskIndex = null;
let timer = null;
let secondsLeft = 0;
let isWorkPhase = true;

const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const tasksDiv = document.getElementById('tasks');
const timerDisplay = document.getElementById('timer-display');
const cancelBtn = document.getElementById('cancel-btn');

// Create and insert phase indicator
const phaseIndicator = document.createElement('div');
phaseIndicator.id = 'phase-indicator';
phaseIndicator.style.marginBottom = '1rem';
phaseIndicator.style.fontWeight = 'bold';
phaseIndicator.style.fontSize = '1.2rem';
document.body.insertBefore(phaseIndicator, timerDisplay);

addTaskBtn.addEventListener('click', () => {
  const desc = taskInput.value.trim();
  if (desc) {
    tasks.push({ description: desc, lemons: 0 });
    taskInput.value = '';
    saveAndRender();
  }
});

cancelBtn.addEventListener('click', cancelTimer);

tasksDiv.addEventListener('click', (e) => {
  const idx = e.target.dataset.index;
  if (e.target.classList.contains('start-btn')) {
    if (timer) return alert('Timer already running!');
    currentTaskIndex = +idx;
    isWorkPhase = true;
    updatePhaseIndicator();
    startTimer(getWorkDuration());
  } else if (e.target.classList.contains('remove-btn')) {
    tasks.splice(idx, 1);
    saveAndRender();
  }
});

function saveAndRender() {
  localStorage.setItem('lemonTasks', JSON.stringify(tasks));
  renderTasks();
}

function renderTasks() {
  tasksDiv.innerHTML = '';
  tasks.forEach((task, i) => {
    const div = document.createElement('div');
    div.className = 'task';
    div.innerHTML = `
      <input value="${task.description}" onchange="updateTask(${i}, this.value)" />
      <button class="start-btn" data-index="${i}">Start</button>
      <button class="remove-btn" data-index="${i}">Remove</button>
      <span class="lemons">${'🍋'.repeat(task.lemons)}</span>
    `;
    tasksDiv.appendChild(div);
  });
}

function updateTask(index, newText) {
  tasks[index].description = newText;
  saveAndRender();
}

function updatePhaseIndicator() {
  phaseIndicator.textContent = isWorkPhase ? 'FOCUS TIME 💼' : 'BREAK TIME 🛋️';
  phaseIndicator.style.color = isWorkPhase ? '#bc6c25' : '#007f5f';
}

function startTimer(duration) {
  secondsLeft = duration;
  updatePhaseIndicator();
  cancelBtn.classList.remove('hidden');
  timer = setInterval(() => {
    if (secondsLeft <= 0) {
      clearInterval(timer);
      timer = null;
      if (isWorkPhase) {
        tasks[currentTaskIndex].lemons++;
        saveAndRender();
        isWorkPhase = false;
        updatePhaseIndicator();
        startTimer(getBreakDuration());
      } else {
        isWorkPhase = true;
        updatePhaseIndicator();
        startTimer(getWorkDuration());
      }
      return;
    }
    timerDisplay.textContent = formatTime(secondsLeft--);
  }, 1000);
}

function cancelTimer() {
  clearInterval(timer);
  timer = null;
  currentTaskIndex = null;
  timerDisplay.textContent = '';
  phaseIndicator.textContent = '';
  cancelBtn.classList.add('hidden');
}

function getWorkDuration() {
  return parseInt(document.getElementById('work-duration').value) * 60;
}

function getBreakDuration() {
  return parseInt(document.getElementById('break-duration').value) * 60;
}

function formatTime(sec) {
  const min = String(Math.floor(sec / 60)).padStart(2, '0');
  const secs = String(sec % 60).padStart(2, '0');
  return `${min}:${secs}`;
}

renderTasks();
