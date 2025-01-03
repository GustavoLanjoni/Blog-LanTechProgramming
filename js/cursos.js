const menuToggle = document.getElementById('menuToggle');
const menu = document.getElementById('menu');

menuToggle.addEventListener('click', () => {
    menu.classList.toggle('active');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
});

const filtros = document.querySelectorAll('.btn-filtro');
const cursos = document.querySelectorAll('.curso');

filtros.forEach(filtro => {
    filtro.addEventListener('click', () => {
        const categoria = filtro.getAttribute('data-filter');

        cursos.forEach(curso => {
            if (categoria === 'todos' || curso.getAttribute('data-category') === categoria) {
                curso.style.display = 'block';
            } else {
                curso.style.display = 'none';
            }
        });
    });
});
