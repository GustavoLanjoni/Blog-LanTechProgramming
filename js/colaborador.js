const searchInput = document.getElementById('search');
const categoryFilter = document.getElementById('category');
const collaboratorCards = document.querySelectorAll('.collaborator-card');

searchInput.addEventListener('input', filterCollaborators);
categoryFilter.addEventListener('change', filterCollaborators);

function filterCollaborators() {
    const searchValue = searchInput.value.toLowerCase();
    const categoryValue = categoryFilter.value;

    collaboratorCards.forEach(card => {
        const name = card.querySelector('h3').innerText.toLowerCase();
        const category = card.dataset.category;

        if (name.includes(searchValue) && (categoryValue === '' || category === categoryValue)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}
