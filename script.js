const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }));
}

document.getElementById('year').textContent = new Date().getFullYear();

const form = document.getElementById('lead-form');
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Formulário demonstrativo. Na próxima etapa, vamos conectar o envio ao WhatsApp ou e-mail oficial da Sistema DNA.');
});
