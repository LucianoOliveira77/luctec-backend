const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB conectado!"))
.catch(err => console.log(err));

const User = mongoose.model("User", {
  email: String,
  password: String
});

const Playlist = mongoose.model("Playlist", {
  userId: String,
  name: String,
  url: String
});

app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) return res.json({ message: "Usuário já existe" });

  const user = new User({ email, password });
  await user.save();
  res.json({ message: "Usuário registrado com sucesso" });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (!user) return res.json({ message: "Credenciais inválidas" });

  res.json({ message: "Login OK", userId: user._id });
});

app.post("/playlist", async (req, res) => {
  const { userId, name, url } = req.body;
  const playlist = new Playlist({ userId, name, url });
  await playlist.save();
  res.json({ message: "Playlist salva com sucesso" });
});

app.get("/playlist/:userId", async (req, res) => {
  const playlists = await Playlist.find({ userId: req.params.userId });
  res.json(playlists);
});

app.get("/", (req, res) => {
  res.send("Backend Luctec rodando 🚀");
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
