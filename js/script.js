// Seleciona o ícone e o menu mobile
const mobileMenuIcon = document.querySelector('.mobile-menu-icon');
const mobileMenu = document.querySelector('.mobile-menu');

// Adiciona um evento de clique para alternar a classe 'active'
mobileMenuIcon.addEventListener('click', () => {
  mobileMenu.classList.toggle('active');
});

