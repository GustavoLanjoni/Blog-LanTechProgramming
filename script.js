// Função para mostrar o conteúdo completo do post
function toggleContent() {
    var content = document.getElementById('full-content');
    var button = document.querySelector('#content button');
    
    if (content.style.display === "none") {
        content.style.display = "block";
        button.textContent = "Leia menos...";
    } else {
        content.style.display = "none";
        button.textContent = "Leia mais...";
    }
}

// Sistema de Curtidas
let likes = 0;
document.getElementById('curtir').onclick = function() {
    likes++;
    document.getElementById('contador-curtidas').textContent = `${likes} curtidas`;
}

// Temporizador de Contagem Regressiva
function startCountdown() {
    let countdownDate = new Date("Dec 31, 2024 23:59:59").getTime();
    let x = setInterval(function() {
        let now = new Date().getTime();
        let distance = countdownDate - now;
        
        let days = Math.floor(distance / (1000 * 60 * 60 * 24));
        let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("countdown").innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;

        if (distance < 0) {
            clearInterval(x);
            document.getElementById("countdown").innerHTML = "EXPIROU";
        }
    }, 1000);
}

startCountdown();
