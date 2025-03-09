const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // Para criar um token JWT (caso deseje adicionar autenticação com token)
const nodemailer = require("nodemailer"); // Adicionando nodemailer

const app = express();
const PORT = 5000;

// Configuração do CORS
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'uploads')));

// Conectar ao MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/meu_blog")
.then(() => console.log("🟢 Conectado ao MongoDB"))
.catch(err => console.error("🔴 Erro ao conectar:", err));

// Definir o modelo de Postagem
const postSchema = new mongoose.Schema({
    titulo: String,
    subtitulo: String,
    conteudo: String,
    categoria: String,
    imagem: String,
    dataPostagem: { type: Date, default: Date.now } // Garante que a data seja salva
});

const Post = mongoose.model("Post", postSchema);

// Definir o modelo de Usuário
const usuarioSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    senha: { type: String, required: true },
});

const Usuario = mongoose.model("Usuario", usuarioSchema);

// Definir o modelo de Comentário (simulando a contagem de comentários)
const comentarioSchema = new mongoose.Schema({
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
    conteudo: String,
    dataComentario: { type: Date, default: Date.now },
});

const Comentario = mongoose.model("Comentario", comentarioSchema);

// Configuração do Multer para upload de imagens
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'uploads'));
    },
    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);
        cb(null, Date.now() + extension);
    }
});

const upload = multer({ storage });

// Rota para adicionar postagem
app.post("/add-post", upload.single("imagem"), async (req, res) => {
    const { titulo, subtitulo, conteudo, categoria } = req.body;
    const imagem = req.file ? req.file.filename : "";
    const dataPostagem = new Date(); // Adicionando a data manualmente

    try {
        const novoPost = new Post({ titulo, subtitulo, categoria, imagem, dataPostagem });
        await novoPost.save();
        res.json({ message: "✅ Postagem adicionada com sucesso!" });
    } catch (error) {
        res.status(500).json({ message: "Erro ao salvar a postagem", error });
    }
});

// Rota para criar um novo usuário
app.post("/criarConta", async (req, res) => {
    const { email, senha } = req.body;

    // Verificação e criação do usuário sem o `role`
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
        return res.status(400).json({ message: "E-mail já cadastrado!" });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const novoUsuario = new Usuario({ email, senha: senhaCriptografada });
    try {
        await novoUsuario.save();
        res.json({ message: "Conta criada com sucesso!" });
    } catch (error) {
        res.status(500).json({ message: "Erro ao criar conta", error });
    }
});

// Rota para login (autenticação)
app.post("/loginAdm", async (req, res) => {
    const { email, senha } = req.body;

    try {
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(400).json({ message: "E-mail ou senha incorretos" });
        }

        // Comparar a senha fornecida com a senha criptografada no banco
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
        if (!senhaCorreta) {
            return res.status(400).json({ message: "E-mail ou senha incorretos" });
        }

        // Gerar um token JWT para o usuário
        const token = jwt.sign({ id: usuario._id }, "secreta", { expiresIn: "1h" });

        res.json({ message: "Login bem-sucedido", token });
    } catch (error) {
        res.status(500).json({ message: "Erro ao realizar login", error });
    }
});

// Rota para buscar postagens por categoria
app.get("/posts/:categoria", async (req, res) => {
    try {
        const categoria = req.params.categoria;
        const posts = await Post.find({ categoria });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar postagens", error });
    }
});

// Rota para enviar o comentário por e-mail
app.post("/enviarComentario", async (req, res) => {
    const { nome, email, mensagem } = req.body;

    // Configuração do transporte para envio de e-mail
    const transporter = nodemailer.createTransport({
        service: "gmail", // Pode usar outro serviço de e-mail como Outlook, etc.
        auth: {
            user: "gustavosilva94514@gmail.com", // Seu e-mail
            pass: "vhhe tuvs twwu arjr" // Senha ou App Password
        }
    });

    const mailOptions = {
        from: "seu-email@gmail.com", // E-mail de origem
        to: "seu-email@gmail.com", // E-mail de destino
        subject: "Novo Comentário Recebido",
        text: `Nome: ${nome}\nE-mail: ${email}\nMensagem: ${mensagem}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).json({ message: "Erro ao enviar o comentário", error });
        }
        res.json({ message: "Comentário enviado com sucesso!" });
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
