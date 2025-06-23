const baseUrl = import.meta.env.VITE_BACKEND_URL || '';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const errorEl = document.getElementById('error');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    try {
      const res = await fetch(baseUrl + '/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        window.location.href = 'dashboard.html';
      } else {
        errorEl.textContent = data.msg || 'Login failed';
      }
    } catch (err) {
      console.error(err);
      errorEl.textContent = 'Error connecting to server';
    }
  });
});