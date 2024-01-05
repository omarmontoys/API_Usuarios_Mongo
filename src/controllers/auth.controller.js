const usuarios = require("../models/usuario.model");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
exports.login = async (req, res) => {
  try {
    const { correo, clave } = req.body;
    if (!correo | !clave) {
      res.status(400).json({
        estado: 0,
        mensaje: "BAD REQUEST",
      });
    } else {
      const usuario = await usuarios.findOne({ correo: correo });
      if (!usuario) {
        res.status(404).json({
          estado: 0,
          mensaje: "Usuario no encontrado",
        });
      } else {
        usuario.clave = clave;
        const salt = await bcryptjs.genSalt(8);
        claveEncriptada = await bcryptjs.hash(clave, salt);
        bcryptjs
          .compare(usuario.clave, claveEncriptada)
          .then(function (resultadoComparacion) {
            if (resultadoComparacion) {
              const maxAge = 3 * 60 * 60;
              const token = jwt.sign(
                { id: usuario._id, correo },
                process.env.TOKEN_ACCESS,
                {
                  expiresIn: maxAge, // 3hrs in sec
                }
              );
              res.cookie("jwt", token, {
                httpOnly: true,
                maxAge: maxAge * 1000, // 3hrs in ms
              });
              res.status(201).json({
                estado: 1,
                mensaje: "Correct Access",
                Token: token,
              });
            } else {
              res.status(401).json({
                estado: 0,
                mensaje: "Contraseña incorrecta",
              });
            }
          });
      }
    }
  } catch (error) {
    res.status(500).json({
      estado: 0,
      mensaje: "Ocurrio un error desconocido",
    });
  }
};
