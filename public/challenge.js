document.addEventListener('DOMContentLoaded', function () {
  var wheel = document.querySelector('.wheel');
  var spinBtn = document.getElementById('spinBtn');

  var segments = [
    'Push-Ups',
    'Burpees',
    'Squats',
    'Plank (1 min)',
    'Lunges',
    'Jumping Jacks',
    'Sit-Ups',
    'Mountain Climbers'
  ];

  var currentRotation = 0;

  spinBtn.addEventListener('click', function () {
    var randomIndex = Math.floor(Math.random() * segments.length);
    var anglePerSegment = 360 / segments.length;
    var newRotation = 360 * 5 + (anglePerSegment * randomIndex);
    currentRotation += newRotation;

    wheel.style.transform = 'rotate(' + currentRotation + 'deg)';

    setTimeout(function () {
      alert('Your Challenge: ' + segments[randomIndex]);
    }, 4200);
  });

  // Add segments to the wheel
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < segments.length; i++) {
    var div = document.createElement('div');
    div.classList.add('segment');
    div.textContent = segments[i];
    fragment.appendChild(div);
  }
  wheel.appendChild(fragment);
});