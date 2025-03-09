document.getElementById('cadastro-form').addEventListener('submit', async function(e) {
    e.preventDefault();  // Previne o comportamento padrão de enviar o formulário

    // Pegando os dados do formulário
    const nomeUsuario = document.getElementById('nomeUsuario').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    const senha = document.getElementById('senha').value;
    const profissao = document.getElementById('profissao').value;

    // Criando o objeto com os dados
    const dados = {
        nomeUsuario,
        email,
        telefone,
        senha,
        profissao
    };

    try {
        // Enviando os dados para o backend
        const resposta = await fetch('/criarConta', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        const result = await resposta.json();

        // Verificando a resposta
        if (resposta.ok) {
            alert(result.message);  // Exibe mensagem de sucesso
            window.location.href = 'login.html';  // Redireciona para a página de login
        } else {
            alert(result.message);  // Exibe mensagem de erro
        }
    } catch (error) {
        console.error("Erro ao enviar dados:", error);
        alert('Ocorreu um erro. Tente novamente.');
    }
});
