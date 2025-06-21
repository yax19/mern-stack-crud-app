document.addEventListener('DOMContentLoaded', function () {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  const logoutBtn = document.getElementById('logoutBtn');
  const toggleRoutine = document.getElementById('toggleRoutine');
  const routineMenu = document.getElementById('routineMenu');
  const workoutList = document.getElementById('workoutList');
  const stopwatchBtn = document.getElementById('stopwatchBtn');
const stopwatchModal = document.getElementById('stopwatchModal');
const timerDisplay = document.getElementById('timerDisplay');
let timerInterval, hours = 0, minutes = 0, seconds = 0;

stopwatchBtn.addEventListener('click', () => {
  stopwatchModal.classList.toggle('hidden');
});

document.getElementById('startTimer').addEventListener('click', () => {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    seconds++;
    if (seconds >= 60) {
      seconds = 0;
      minutes++;
    }
    if (minutes >= 60) {
      minutes = 0;
      hours++;
    }
    timerDisplay.textContent =
      String(hours).padStart(2, '0') + ':' +
      String(minutes).padStart(2, '0') + ':' +
      String(seconds).padStart(2, '0');
  }, 1000);
});

document.getElementById('stopTimer').addEventListener('click', () => {
  clearInterval(timerInterval);
});

document.getElementById('resetTimer').addEventListener('click', () => {
  clearInterval(timerInterval);
  hours = minutes = seconds = 0;
  timerDisplay.textContent = '00:00:00';
});

  logoutBtn.addEventListener('click', function () {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
  });

  if (toggleRoutine && routineMenu) {
    toggleRoutine.addEventListener('click', function () {
      routineMenu.classList.toggle('hidden');
    });
  }

  async function fetchWorkouts() {
    workoutList.innerHTML = '';
    try {
      const res = await fetch('/api/workouts', {
        headers: {
          Authorization: 'Bearer ' + token
        }
      });
      const data = await res.json();

      // Show workout cards
      data.forEach(function (w) {
        const card = document.createElement('div');
        card.className = 'workout-card';

        let content = '<strong>' + w.name + '</strong><br/>';
        if (w.type === 'Strength') {
          content += w.sets + ' sets x ' + w.reps + ' reps';
        } else {
          content += w.duration + ' mins';
        }

        card.innerHTML = content;
        workoutList.appendChild(card);
      });

      updateSummary(data);
      updateRecent(data);
      showQuote();
    } catch (err) {
      console.error('Failed to load workouts:', err);
    }
  }

  function updateSummary(data) {
    let totalSets = 0;
    let totalReps = 0;
    let totalDuration = 0;

    data.forEach(function (w) {
      if (w.sets) totalSets += w.sets;
      if (w.reps) totalReps += w.reps;
      if (w.duration) totalDuration += w.duration;
    });

    document.getElementById('totalWorkouts').textContent = data.length;
    document.getElementById('totalSets').textContent = totalSets;
    document.getElementById('totalReps').textContent = totalReps;
    document.getElementById('totalDuration').textContent = totalDuration;
  }

  function updateRecent(data) {
    const list = document.getElementById('recentList');
    list.innerHTML = '';
    data.slice(0, 3).forEach(function (w) {
      const li = document.createElement('li');
      li.textContent = w.name + ' - ' + w.type;
      list.appendChild(li);
    });
  }

  function showQuote() {
    const quotes = [
      "Push yourself, because no one else is going to do it for you.",
      "Don’t stop when you’re tired. Stop when you’re done.",
      "Success starts with self-discipline.",
      "The pain you feel today will be the strength you feel tomorrow."
    ];
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    document.getElementById('quoteText').textContent = quote;
  }

  fetchWorkouts();
});