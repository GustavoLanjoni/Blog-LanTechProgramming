const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // Para criar um token JWT (caso deseje adicionar autenticação com token)

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
    const { email, senha } = req.body;  // Remova role daqui

    // Verificação e criação do usuário sem o `role`
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
        return res.status(400).json({ message: "E-mail já cadastrado!" });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const novoUsuario = new Usuario({ email, senha: senhaCriptografada }); // Sem o `role`
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

        // Gerar um token JWT para o usuário (caso deseje implementar autenticação por token)
        const token = jwt.sign({ id: usuario._id, role: usuario.role }, "secreta", { expiresIn: "1h" });

        res.json({ message: "Login bem-sucedido", token }); // Retorna o token gerado
    } catch (error) {
        res.status(500).json({ message: "Erro ao realizar login", error });
    }
});

// Rota para buscar postagens por categoria
app.get("/posts/:categoria", async (req, res) => {
    try {
        const categoria = req.params.categoria;
        console.log("Categoria recebida:", categoria); // Adicionado para debug
        const posts = await Post.find({ categoria });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar postagens", error });
    }
});

// Rota para contar o total de posts
app.get("/posts/total", async (req, res) => {
    try {
        const totalPosts = await Post.countDocuments();
        res.json({ total: totalPosts });
    } catch (error) {
        res.status(500).json({ message: "Erro ao contar posts", error });
    }
});

// Rota para contar o total de comentários
app.get("/comments/total", async (req, res) => {
    try {
        const totalComments = await Comentario.countDocuments();
        res.json({ total: totalComments });
    } catch (error) {
        res.status(500).json({ message: "Erro ao contar comentários", error });
    }
});

// Rota para contar o total de usuários
app.get("/users/total", async (req, res) => {
    try {
        const totalUsers = await Usuario.countDocuments();
        res.json({ total: totalUsers });
    } catch (error) {
        res.status(500).json({ message: "Erro ao contar usuários", error });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
