require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

// Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("MongoDB conectado"))
  .catch(err => console.error(err));

// Definir esquema do post
const PostSchema = new mongoose.Schema({
    title: String,
    subtitle: String,
    content: String,
    category: String,
    imageUrl: String,
    createdAt: { type: Date, default: Date.now }
});

const Post = mongoose.model("Post", PostSchema);

// Configurar armazenamento de imagens
const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

// Rota para criar postagem
app.post("/posts", upload.single("postImage"), async (req, res) => {
    try {
        const { postTitle, postSubtitle, postContent, postCategory } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

        const newPost = new Post({
            title: postTitle,
            subtitle: postSubtitle,
            content: postContent,
            category: postCategory,
            imageUrl
        });

        await newPost.save();
        res.status(201).json({ message: "Postagem criada com sucesso!" });
    } catch (error) {
        res.status(500).json({ error: "Erro ao criar postagem" });
    }
});

// Rota para obter postagens
app.get("/posts", async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar postagens" });
    }
});

// Servir imagens
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
