const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcrypt");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Para receber JSON nas requisições
app.use(express.urlencoded({ extended: true })); // Para receber formulários
app.use(express.static(path.join(__dirname))); // Servindo arquivos estáticos

// Conexão com o MongoDB
mongoose.connect("mongodb://localhost:27017/bloglantech", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("Conectado ao MongoDB"))
  .catch(err => console.log("Erro ao conectar ao MongoDB:", err));

// Definição do Schema de Usuário (Login)
const userSchema = new mongoose.Schema({
  email: String,
  senha: String
});

const User = mongoose.model("User", userSchema);

// Definição do Schema de Postagens
const postSchema = new mongoose.Schema({
  titulo: String,
  subtitulo: String,
  conteudo: String,
  imagem: String,
  categoria: String
});

const Post = mongoose.model("Post", postSchema);

// Criar usuários padrão (se ainda não existirem)
async function criarUsuariosPadrao() {
  const usuarios = [
    { email: "gustavosilva94514@gmail.com", senha: "Gustavo#2393" },
    { email: "mileneangelo6@gmail.com", senha: "Milene#2393" }
  ];

  for (let usuario of usuarios) {
    const usuarioExiste = await User.findOne({ email: usuario.email });

    if (!usuarioExiste) {
      const senhaCriptografada = await bcrypt.hash(usuario.senha, 10);
      await new User({ email: usuario.email, senha: senhaCriptografada }).save();
      console.log(`Usuário ${usuario.email} criado.`);
    }
  }
}

criarUsuariosPadrao();

// Configuração do multer (para upload de imagens)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Rota para criar postagens
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
  const { categoria } = req.query;
  const query = categoria ? { categoria } : {};
  const posts = await Post.find(query);
  res.json(posts);
});

// Rota para login
app.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;
    const usuario = await User.findOne({ email });

    if (!usuario) {
      return res.status(401).json({ error: "E-mail ou senha inválidos" });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(401).json({ error: "E-mail ou senha inválidos" });
    }

    res.json({ message: "Login realizado com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao processar login" });
  }
});

// Rota para servir o index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Iniciando o servidor
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
