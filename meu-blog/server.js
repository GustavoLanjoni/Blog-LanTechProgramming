const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());

// Conexão com o MongoDB
mongoose.connect('mongodb://localhost:27017/Blog')
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.log('Erro ao conectar ao MongoDB: ', err));

// Esquema de Postagem
const postSchema = new mongoose.Schema({
    titulo: String,
    subtitulo: String,
    conteudo: String,
    imagem: String,
    categoria: String
});

const Post = mongoose.model("Post", postSchema);

// Configuração do multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Servindo arquivos estáticos
app.use(express.static(path.join(__dirname, 'BLOG-LANTECH'))); // Atualizado para a pasta BLOG-LANTECH

// Rota para criação de postagens
app.post("/posts", upload.single("postImage"), async (req, res) => {
    try {
        const { postTitle, postSubtitle, postContent, categoria } = req.body;
        const imagem = req.file ? req.file.buffer.toString("base64") : null;

        const post = new Post({
            titulo: postTitle,
            subtitulo: postSubtitle,
            conteudo: postContent,
            imagem,
            categoria
        });

        await post.save();
        res.status(201).json({ message: "Postagem criada com sucesso!" });
    } catch (error) {
        res.status(500).json({ error: "Erro ao criar postagem" });
    }
});

// Rota para listar postagens
app.get("/posts", async (req, res) => {
    const { categoria } = req.query; // Filtra por categoria se houver parâmetro na URL
    const query = categoria ? { categoria } : {};
    const posts = await Post.find(query);
    res.json(posts);
});

// Rota para servir o index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'BLOG-LANTECH', 'index.html')); // Atualizado para a pasta BLOG-LANTECH
});

// Iniciando o servidor
app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
