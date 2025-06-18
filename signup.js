const form = document.getElementById('signupForm');
const message = document.getElementById('message');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const res = await fetch('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (res.ok) {
      // Optional: brief success message
      message.style.color = 'green';
      message.textContent = 'Account created! Redirecting...';

      // Redirect after 1.5 seconds
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);
    } else {
      message.style.color = 'red';
      message.textContent = data.msg || 'Signup failed.';
    }
  } catch (err) {
    message.style.color = 'red';
    message.textContent = 'Error connecting to server.';
    console.error(err);
  }
});