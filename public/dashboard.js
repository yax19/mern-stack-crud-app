const token = localStorage.getItem('token');
const workoutsList = document.getElementById('workoutsList');
const modal = document.getElementById('modal');
const addBtn = document.getElementById('addBtn');

// Show modal
addBtn.onclick = () => {
  modal.style.display = 'block';
};

// Close modal
function closeModal() {
  modal.style.display = 'none';
}

// Load workouts
function loadWorkouts() {
  fetch('http://localhost:3000/api/workouts', {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
  .then(res => res.json())
  .then(workouts => {
    workoutsList.innerHTML = '';
    workouts.forEach(w => {
      const workoutText = w.type === 'Cardio'
        ? `${w.name} (${w.type}) - ${w.duration} min`
        : `${w.name} (${w.type}) - ${w.sets} sets x ${w.reps} reps`;
      const div = document.createElement('div');
      div.textContent = workoutText;
      workoutsList.appendChild(div);
    });
  });
}

// Save workout
function saveWorkout() {
  const name = document.getElementById('workoutName').value;
  const type = document.getElementById('workoutType').value;
  const sets = document.getElementById('sets').value;
  const reps = document.getElementById('reps').value;
  const duration = document.getElementById('duration').value;

  const workout = { name, type };

  if (type === 'Cardio') {
    workout.duration = duration;
  } else {
    workout.sets = sets;
    workout.reps = reps;
  }

  fetch('http://localhost:3000/api/workouts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify(workout)
  })
  .then(() => {
    closeModal();
    loadWorkouts();
  });
}

// Expose saveWorkout and closeModal to HTML
window.saveWorkout = saveWorkout;
window.closeModal = closeModal;

// Initial load
loadWorkouts();
