
const toggle = document.getElementById('modo-toggle');
const body = document.body;

// Cargar preferencia guardada
if (localStorage.getItem('modo') === 'oscuro') {
  body.classList.add('dark-mode');
  toggle.textContent = '☀️';
}

toggle.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  const modo = body.classList.contains('dark-mode') ? 'oscuro' : 'claro';
  localStorage.setItem('modo', modo);
  toggle.textContent = modo === 'oscuro' ? '☀️' : '🌙';
});
