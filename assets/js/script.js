// script.js
document.querySelectorAll('a[href]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    document.body.classList.add('fade-out');
    setTimeout(() => {
      window.location.href = link.href;
    }, 300);
  });
});

let currentSlide = 0;
        const slides = document.querySelector('.slides');
        const totalSlides = document.querySelectorAll('.slide').length;

        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            slides.style.transform = `translateX(-${currentSlide * 25}%)`;
        }

        setInterval(nextSlide, 2000);

// Scroll to top button
document.querySelector('.scroll-top').addEventListener('click', function(e) {
  e.preventDefault();
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

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
