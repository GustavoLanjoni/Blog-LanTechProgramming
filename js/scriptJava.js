// Função de Curtida
let likeCount = 0;
const likeButton = document.getElementById('like-button');
const likeCountDisplay = document.getElementById('like-count');

likeButton.addEventListener('click', function () {
    likeCount++;
    likeCountDisplay.textContent = likeCount;
    localStorage.setItem('likeCount', likeCount); // Salva no navegador
});

// Recuperando a contagem de curtidas ao carregar a página
window.onload = function() {
    const savedLikeCount = localStorage.getItem('likeCount');
    if (savedLikeCount) {
        likeCount = parseInt(savedLikeCount);
        likeCountDisplay.textContent = likeCount;
    }
};

// Função de Compartilhar
const shareButton = document.getElementById('share-button');

shareButton.addEventListener('click', function () {
    const shareData = {
        title: 'Java vs JavaScript: Qual a Diferença?',
        text: 'Descubra as principais diferenças entre Java e JavaScript e qual escolher para o seu projeto!',
        url: window.location.href
    };

    if (navigator.share) {
        navigator.share(shareData)
            .then(() => console.log('Conteúdo compartilhado com sucesso!'))
            .catch((error) => console.error('Erro ao compartilhar:', error));
    } else {
        alert('Compartilhar não é suportado neste navegador.');
    }
});

// Função de Comentários
const writeCommentLink = document.getElementById('write-comment-link');
const commentForm = document.getElementById('comment-form');
const addCommentButton = document.getElementById('add-comment-button');
const commentList = document.getElementById('comment-list');

writeCommentLink.addEventListener('click', function () {
    commentForm.style.display = 'block';
});

addCommentButton.addEventListener('click', function () {
    const username = document.getElementById('username-input').value;
    const comment = document.getElementById('comment-input').value;

    if (username && comment) {
        const commentItem = document.createElement('li');
        commentItem.innerHTML = `<strong>${username}:</strong> ${comment} <button class="reply-button">Responder</button>`;

        // Adiciona o comentário à lista
        commentList.appendChild(commentItem);

        // Limpar campos
        document.getElementById('username-input').value = '';
        document.getElementById('comment-input').value = '';

        // Armazenar comentários no navegador
        const comments = JSON.parse(localStorage.getItem('comments')) || [];
        comments.push({ username, comment });
        localStorage.setItem('comments', JSON.stringify(comments));

        // Exibe os comentários ao carregar a página
        displayComments();
    } else {
        alert('Por favor, preencha todos os campos!');
    }
});

// Exibir comentários armazenados ao carregar a página
function displayComments() {
    const comments = JSON.parse(localStorage.getItem('comments')) || [];
    commentList.innerHTML = '';

    comments.forEach(function (comment) {
        const commentItem = document.createElement('li');
        commentItem.innerHTML = `<strong>${comment.username}:</strong> ${comment.comment} <button class="reply-button">Responder</button>`;
        commentList.appendChild(commentItem);
    });
}

// Exibir comentários ao carregar a página
window.onload = function () {
    displayComments();
};
