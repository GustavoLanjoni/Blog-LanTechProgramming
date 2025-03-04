document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Evita o recarregamento da página

    // Credenciais autorizadas
    const adminUsers = [
        { email: "gustavosilva94514@gmail.com", password: "Gustavo#2393" },
        { email: "mileneangelo6@gmail.com", password: "Milene#2393" }
    ];

    // Captura os valores inseridos pelo usuário
    const emailDigitado = document.getElementById("email").value;
    const senhaDigitada = document.getElementById("password").value;

    // Verifica se a credencial está na lista de administradores
    const usuarioValido = adminUsers.find(user => user.email === emailDigitado && user.password === senhaDigitada);

    if (usuarioValido) {
        alert("Login realizado com sucesso!");
        window.location.href = "admin.html"; // Redireciona para o painel do admin
    } else {
        document.getElementById("error-message").textContent = "E-mail ou senha incorretos!";
    }
});
