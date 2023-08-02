const express = require("express");
const router = express.Router();
const path = require("path");
const { checkCredentialsExists, tokenVerification } = require("../middlewares");
const { registrarUsuario, verificarCredenciales } = require("../consultas");

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client-app/public/index.html"));
});

router.post("/", checkCredentialsExists, async (req, res) => {
  try {
    const usuario = req.body;
    const usuarioRegistrado = await registrarUsuario(usuario);
    res.json({
      message: "USUARIO REGISTRADO CON ÉXITO",
      usuario: usuarioRegistrado,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "ERROR AL REGISTRAR EL USUARIO",
        error,
      });
  }
});

router.get("/usuarios", tokenVerification, async (req, res) => {
  try {
    const token = req.header("Authorization").split("bearer")[1];
    const { email } = jwt.decode(token);
    const usuario = await obtenerDatosUsuario(email);
    res.json(usuario);
  } catch (error) {
    const { code, message } = error;
    res.status(code).send(message);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    await verificarCredenciales(email, password);
    const token = jwt.sign({ email }, process.env("SECRECT_KEY"));
    res.send(token);
  } catch ({ code, message }) {
    res.status(code).send(message);
  }
});

module.exports = router;
