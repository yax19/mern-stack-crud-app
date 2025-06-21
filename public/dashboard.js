document.addEventListener('DOMContentLoaded', () => {
const token = localStorage.getItem('token');
if (!token) {
  window.location.href = 'login.html';
}

const workoutList = document.getElementById('workoutList');
const logoutBtn = document.getElementById('logoutBtn');
const addBtn = document.getElementById('addBtn');
const modal = document.getElementById('modal');
const form = document.getElementById('workoutForm');
const stopwatchBtn = document.getElementById('stopwatchBtn');
const stopwatchModal = document.getElementById('stopwatchModal');

// Fetch and display workouts
async function fetchWorkouts() {
  workoutList.innerHTML = '';

  try {
    const res = await fetch('/api/workouts', {
      headers: { Authorization: 'Bearer ' + token }
    });

    const data = await res.json();

    for (let i = 0; i < data.length; i++) {
      const w = data[i];
      const div = document.createElement('div');
      div.className = 'workout-card';
      div.innerHTML = 
        '<strong>' + w.name + '</strong><br/>' +
        (w.type === 'Strength'
          ? w.sets + ' sets x ' + w.reps + ' reps'
          : w.duration + ' mins');
      workoutList.appendChild(div);
    }

    updateSummary(data);
    updateRecent(data);
    showQuote();
    
  } catch (err) {
    console.error('Error loading workouts:', err);
  }
}

 form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const workout = {
    name: document.getElementById('name').value,
    type: document.getElementById('type').value,
    sets: document.getElementById('sets').value || null,
    reps: document.getElementById('reps').value || null,
    duration: document.getElementById('duration').value || null
  };

  try {
    const res = await fetch('/api/workouts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      },
      body: JSON.stringify(workout)
    });

    if (res.ok) {
      modal.classList.add('hidden');
      form.reset();
      fetchWorkouts();
    } else {
      alert('Failed to save workout');
    }
  } catch (err) {
    console.error('Error submitting workout:', err);
    alert('Error submitting workout');
  }
});
function updateSummary(data) {
  let totalSets = 0;
  let totalReps = 0;
  let totalDuration = 0;

  for (let i = 0; i < data.length; i++) {
    const w = data[i];
    if (w.sets) totalSets += w.sets;
    if (w.reps) totalReps += w.reps;
    if (w.duration) totalDuration += w.duration;
  }

  document.getElementById('totalWorkouts').textContent = data.length;
  document.getElementById('totalSets').textContent = totalSets;
  document.getElementById('totalReps').textContent = totalReps;
  document.getElementById('totalDuration').textContent = totalDuration;
}

// Recent Workouts
function updateRecent(data) {
  const list = document.getElementById('recentList');
  list.innerHTML = '';

  const max = data.length < 3 ? data.length : 3;
  for (let i = 0; i < max; i++) {
    const w = data[i];
    const li = document.createElement('li');
    li.textContent = w.name + ' - ' + w.type;
    list.appendChild(li);
  }
}

function showQuote() {
  const quotes = [
    'Push yourself, because no one else is going to do it for you.',
    'Don’t stop when you’re tired. Stop when you’re done.',
    'Success starts with self-discipline.',
    'The pain you feel today will be the strength you feel tomorrow.'
  ];

  const index = Math.floor(Math.random() * quotes.length);
  document.getElementById('quoteText').textContent = quotes[index];
}

// Show/hide modal
addBtn.addEventListener('click', function () {
  modal.classList.toggle('hidden');
});

// Stopwatch modal toggle
stopwatchBtn.addEventListener('click', function () {
  stopwatchModal.classList.toggle('hidden');
});

// Logout
logoutBtn.addEventListener('click', function () {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
});

// Stopwatch functionality
let timerInterval;
let seconds = 0;

function updateTimerDisplay() {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  document.getElementById('timerDisplay').textContent =
    (hrs < 10 ? '0' + hrs : hrs) + ':' +
    (mins < 10 ? '0' + mins : mins) + ':' +
    (secs < 10 ? '0' + secs : secs);
}

document.getElementById('startTimer').addEventListener('click', function () {
  if (!timerInterval) {
    timerInterval = setInterval(function () {
      seconds++;
      updateTimerDisplay();
    }, 1000);
  }
});
document.getElementById('stopTimer').addEventListener('click', function () {
  clearInterval(timerInterval);
  timerInterval = null;
});

document.getElementById('resetTimer').addEventListener('click', function () {
  clearInterval(timerInterval);
  timerInterval = null;
  seconds = 0;
  updateTimerDisplay();
});

// Load everything
fetchWorkouts();
});