require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Conectar ao MongoDB Local
mongoose.connect("mongodb://localhost:27017/blog", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB conectado!"))
  .catch(err => console.error("Erro ao conectar:", err));

const PostSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  content: String,
  category: String,
  imageURL: String,
  createdAt: { type: Date, default: Date.now }
});

const Post = mongoose.model("Post", PostSchema);

// Rota para criar um post
app.post("/posts", async (req, res) => {
  try {
    const newPost = new Post(req.body);
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rota para listar posts
app.get("/posts", async (req, res) => {
  const posts = await Post.find();
  res.json(posts);
});

// Iniciar o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
