// Selecionando os elementos do menu
const mobileMenuIcon = document.querySelector('.mobile-menu-icon');
const mobileMenu = document.querySelector('.mobile-menu');

// Adicionando um evento de clique no ícone do menu
mobileMenuIcon.addEventListener('click', () => {
    // Alternando o display do menu
    mobileMenu.style.display = mobileMenu.style.display === 'flex' ? 'none' : 'flex';
});
