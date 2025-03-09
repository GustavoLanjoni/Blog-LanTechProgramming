const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

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


// Rota para buscar postagens por categoria
app.get("/posts/:categoria", async (req, res) => {
    try {
        const categoria = req.params.categoria;
        console.log("Categoria recebida:", categoria); // Adicionado para debug
        const posts = await Post.find({ categoria });
        //...
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar postagens", error });
    }
});



// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
