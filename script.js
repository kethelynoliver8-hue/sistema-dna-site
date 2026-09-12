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
  const data = new FormData(form);
  const nome = data.get('nome') || '';
  const telefone = data.get('telefone') || '';
  const tipo = data.get('tipo') || '';
  const mensagem = data.get('mensagem') || '';
  const texto = `Olá, vim através do site. Preciso de atendimento!

Nome: ${nome}
WhatsApp: ${telefone}
Tipo de imóvel: ${tipo}
Necessidade: ${mensagem}`;
  window.open(`https://wa.me/5548996865570?text=${encodeURIComponent(texto)}`, '_blank', 'noopener');
});