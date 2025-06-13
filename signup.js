const form = document.getElementById('signupForm');
const message = document.getElementById('message');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  try {
    const res = await fetch('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (res.ok) {
      message.style.color = '#00ffcc';
      message.textContent = 'Account created successfully!';
      form.reset();
      // Optional: redirect to login page
      // window.location.href = 'login.html';
    } else {
      message.style.color = 'red';
      message.textContent = data.msg || 'Signup failed.';
    }
  } catch (err) {
    console.error(err);
    message.style.color = 'red';
    message.textContent = 'Error connecting to server.';
  }
});
