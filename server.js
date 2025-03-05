const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");

const app = express();
app.use(cors());

mongoose.connect("mongodb://localhost:27017/blog", { useNewUrlParser: true, useUnifiedTopology: true });

const postSchema = new mongoose.Schema({
    titulo: String,
    subtitulo: String,
    conteudo: String,
    imagem: String,
    categoria: String
});

const Post = mongoose.model("Post", postSchema);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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

app.get("/posts", async (req, res) => {
    const { categoria } = req.query; // Filtra por categoria se houver parâmetro na URL
    const query = categoria ? { categoria } : {};
    const posts = await Post.find(query);
    res.json(posts);
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
