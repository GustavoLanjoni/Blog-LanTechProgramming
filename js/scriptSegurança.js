document.addEventListener("DOMContentLoaded", () => {
    let likeCount = 0;

    // Recupera o número de curtidas do localStorage, se existir
    if (localStorage.getItem("likeCount")) {
        likeCount = parseInt(localStorage.getItem("likeCount"));
        document.getElementById("like-count").textContent = likeCount;
    }

    // Handle like button
    const likeButton = document.getElementById("like-button");
    likeButton.addEventListener("click", () => {
        likeCount++;
        document.getElementById("like-count").textContent = likeCount;

        // Salva o número de curtidas no localStorage
        localStorage.setItem("likeCount", likeCount);
    });

    // Recupera os comentários do localStorage, se existir
    const savedComments = JSON.parse(localStorage.getItem("comments")) || [];
    const commentList = document.getElementById("comment-list");

    // Exibe os comentários armazenados
    savedComments.forEach((comment) => {
        displayComment(comment);
    });

    // Handle share button
    const shareButton = document.getElementById("share-button");
    shareButton.addEventListener("click", () => {
        const pageUrl = window.location.href;
        const textToShare = `Confira este link interessante: ${pageUrl}`;

        if (navigator.share) {
            navigator.share({
                title: document.title,
                text: textToShare,
                url: pageUrl
            }).then(() => {
                console.log("Compartilhamento realizado com sucesso!");
            }).catch((error) => {
                console.error("Erro ao compartilhar:", error);
            });
        } else {
            alert(`Compartilhe este link: ${pageUrl}`);
        }
    });

    // Handle comments
    const writeCommentLink = document.getElementById("write-comment-link");
    const commentForm = document.getElementById("comment-form");
    const addCommentButton = document.getElementById("add-comment-button");
    const commentInput = document.getElementById("comment-input");
    const usernameInput = document.getElementById("username-input");

    // Mostrar o formulário de comentário
    writeCommentLink.addEventListener("click", () => {
        commentForm.style.display = "block";
        writeCommentLink.style.display = "none";
    });

    // Adiciona o comentário
    addCommentButton.addEventListener("click", () => {
        const username = usernameInput.value.trim();
        const commentText = commentInput.value.trim();

        if (username && commentText) {
            const comment = { username, text: commentText, likes: 0, replies: [] };
            displayComment(comment);

            // Salva o novo comentário no localStorage
            savedComments.push(comment);
            localStorage.setItem("comments", JSON.stringify(savedComments));

            commentInput.value = "";
            usernameInput.value = "";
            commentForm.style.display = "none";
            writeCommentLink.style.display = "block";
        } else {
            alert("Por favor, insira um nome e um comentário!");
        }
    });

    // Função para exibir um comentário
    function displayComment(comment) {
        const commentItem = document.createElement("li");
        commentItem.classList.add("comment-item");

        commentItem.innerHTML = `
            <strong>${comment.username}</strong>: ${comment.text}
            <button class="like-comment-button">Curtir ❤️ <span class="like-count">${comment.likes}</span></button>
            <button class="reply-comment-button">Responder</button>
            <ul class="reply-list"></ul>
            <textarea class="reply-input" placeholder="Escreva sua resposta..." style="display: none;"></textarea>
            <button class="send-reply-button" style="display: none;">Enviar Resposta</button>
        `;

        // Curtir o comentário
        const likeButton = commentItem.querySelector(".like-comment-button");
        const likeCountElement = commentItem.querySelector(".like-count");
        let commentLikeCount = comment.likes;

        likeButton.addEventListener("click", () => {
            commentLikeCount++;
            likeCountElement.textContent = commentLikeCount;
            
            // Atualiza o número de curtidas no localStorage
            comment.likes = commentLikeCount;
            localStorage.setItem("comments", JSON.stringify(savedComments));
        });

        // Responder ao comentário
        const replyButton = commentItem.querySelector(".reply-comment-button");
        const replyInput = commentItem.querySelector(".reply-input");
        const sendReplyButton = commentItem.querySelector(".send-reply-button");
        const replyList = commentItem.querySelector(".reply-list");

        replyButton.addEventListener("click", () => {
            replyInput.style.display = "block";
            sendReplyButton.style.display = "block";
        });

        sendReplyButton.addEventListener("click", () => {
            const replyText = replyInput.value.trim();
            if (replyText) {
                const replyItem = document.createElement("li");
                replyItem.innerHTML = `<strong>Você</strong>: ${replyText}`;
                replyList.appendChild(replyItem);
                replyInput.value = "";
                replyInput.style.display = "none";
                sendReplyButton.style.display = "none";

                // Salva a resposta no comentário
                comment.replies.push(replyText);
                localStorage.setItem("comments", JSON.stringify(savedComments));
            } else {
                alert("Por favor, insira uma resposta!");
            }
        });

        commentList.appendChild(commentItem);
    }
});
