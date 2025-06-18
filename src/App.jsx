document.getElementById('signinForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const res = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.msg || 'Login failed');

    localStorage.setItem('token', data.token);
    window.location.href = 'dashboard.html'; 
  } catch (err) {
    document.getElementById('error').innerText = err.message;
  }
});