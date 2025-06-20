document.addEventListener('DOMContentLoaded', function () {
  var token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'index.html';
    return;
  }

  var workoutList = document.getElementById('workoutList');
  var logoutBtn = document.getElementById('logoutBtn');
  var addBtn = document.getElementById('addBtn');
  var modal = document.getElementById('modal');
  var form = document.getElementById('workoutForm');

  function fetchWorkouts() {
    workoutList.innerHTML = '';
    fetch('/api/workouts', {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        data.forEach(function (w) {
          var isStrength = w.type === 'Strength';
          var details = isStrength
            ? w.sets + ' sets x ' + w.reps + ' reps'
            : w.duration;

          var div = document.createElement('div');
          div.className = 'workout-card';
          div.innerHTML = '<strong>' + w.name + '</strong><br/>' + details;
          workoutList.appendChild(div);
        });
      })
      .catch(function (err) {
        console.error('Error loading workouts:', err);
      });
  }

  if (addBtn) {
    addBtn.addEventListener('click', function () {
      if (modal) {
        modal.classList.toggle('hidden');
      }
    });
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var workout = {
        name: document.getElementById('name').value,
        type: document.getElementById('type').value,
        sets: document.getElementById('sets').value || null,
        reps: document.getElementById('reps').value || null,
        duration: document.getElementById('duration').value || null
      };

      fetch('/api/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        },
        body: JSON.stringify(workout)
      })
        .then(function (res) {
          if (res.ok) {
            if (modal) modal.classList.add('hidden');
            form.reset();
            fetchWorkouts();
          } else {
            alert('Failed to save workout');
          }
        })
        .catch(function (err) {
          alert('Error submitting workout');
          console.error(err);
        });
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', function () {
      localStorage.removeItem('token');
      window.location.href = 'index.html';
    });
  }

  fetchWorkouts();
});
