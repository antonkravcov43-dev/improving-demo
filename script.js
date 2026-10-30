const WHATSAPP = '79001258084';

// Шапка и мобильная кнопка
const header = document.getElementById('header');
const mobileCta = document.querySelector('.mobile-cta');
const calcSection = document.getElementById('prices');

function onScroll() {
  header.classList.toggle('is-scrolled', window.scrollY > 40);
  const r = calcSection.getBoundingClientRect();
  const nearCalc = r.top < window.innerHeight && r.bottom > 0;
  mobileCta.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.7 && !nearCalc);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Мобильное меню
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
burger.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  burger.setAttribute('aria-expanded', open);
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('is-open');
  burger.setAttribute('aria-expanded', 'false');
}));

// Эквалайзер: случайная высота и скорость столбиков
document.querySelectorAll('.eq i').forEach(bar => {
  bar.style.setProperty('--h', (0.25 + Math.random() * 0.75).toFixed(2));
  bar.style.animationDuration = `${0.5 + Math.random() * 0.9}s`;
  bar.style.animationDelay = `${-Math.random()}s`;
});

// Появление блоков
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('is-visible');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 70}ms`;
  io.observe(el);
});

// Калькулятор → WhatsApp
const checks = [...document.querySelectorAll('#calcList input')];
const totalEl = document.getElementById('calcTotal');
const hintEl = document.getElementById('calcHint');
const carInput = document.getElementById('calcCar');
const sendBtn = document.getElementById('calcSend');
const fmt = n => n.toLocaleString('ru-RU');

function updateCalc() {
  const chosen = checks.filter(c => c.checked);
  const total = chosen.reduce((s, c) => s + Number(c.dataset.price), 0);
  totalEl.textContent = fmt(total);
  hintEl.textContent = chosen.length
    ? `Выбрано услуг: ${chosen.length}. Точную цену мастер назовёт после осмотра.`
    : 'Выберите одну или несколько услуг';

  const lines = ['Здравствуйте! Пишу с сайта, хочу записаться.'];
  if (carInput.value.trim()) lines.push(`Автомобиль: ${carInput.value.trim()}`);
  if (chosen.length) {
    lines.push('Интересует:');
    chosen.forEach(c => lines.push(`— ${c.dataset.name}`));
    lines.push(`Ориентировочно: от ${fmt(total)} ₽`);
  }
  sendBtn.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lines.join('\n'))}`;
}
checks.forEach(c => c.addEventListener('change', updateCalc));
carInput.addEventListener('input', updateCalc);
updateCalc();

// Фильтр работ
const works = [...document.querySelectorAll('#worksGrid img')];
document.querySelectorAll('.filter').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach(b => b.classList.toggle('is-active', b === btn));
    const f = btn.dataset.filter;
    works.forEach(img => img.classList.toggle('is-hidden', f !== 'all' && img.dataset.cat !== f));
  });
});

// Лайтбокс для кейсов и работ
const lightbox = document.getElementById('lightbox');
const lbImg = lightbox.querySelector('img');
let pool = [];
let current = 0;

function visiblePhotos() {
  return [...document.querySelectorAll('.case img'), ...works.filter(i => !i.classList.contains('is-hidden'))];
}
function showPhoto(i) {
  current = (i + pool.length) % pool.length;
  lbImg.src = pool[current].src;
  lbImg.alt = pool[current].alt;
}
function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = '';
}
document.querySelectorAll('.case img, #worksGrid img').forEach(img => img.addEventListener('click', () => {
  pool = visiblePhotos();
  showPhoto(pool.indexOf(img));
  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';
}));
lightbox.querySelector('.lightbox__prev').addEventListener('click', () => showPhoto(current - 1));
lightbox.querySelector('.lightbox__next').addEventListener('click', () => showPhoto(current + 1));
lightbox.querySelector('.lightbox__close').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => {
  if (lightbox.hidden) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') showPhoto(current - 1);
  if (e.key === 'ArrowRight') showPhoto(current + 1);
});
