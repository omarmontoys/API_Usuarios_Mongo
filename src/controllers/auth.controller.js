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
        //console.log("----" + clave);
        //console.log(usuario.clave);
        const compare = await bcryptjs.compare(clave, usuario.clave);
        //console.log(compare);
        if (compare) {
          //console.log("entré al if");
          const user = await usuarios.findOne({ correo });
          //console.log(user);
          const userId = user._id;
          //console.log("--" + userId);
          const userEmail = user.correo;
          //console.log("--" + userEmail);
          const token = jwt.sign(
            { id: userId, userEmail },
            process.env.TOKEN_ACCESS
          );
          //console.log(token);
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
      }
    }
  } catch (error) {
    res.status(500).json({
      estado: 0,
      mensaje: "Ocurrio un error desconocido",
    });
  }
};
exports.register = async (req, res) => {
  try {
    const { nombre, apellidos, usuario, correo, clave } = req.body;
    if (!nombre | !apellidos | !usuario | !correo | !clave) {
      res.status(400).json({
        estado: 0,
        mensaje: "Falta algún campo.",
      });
    } else {
      const usuarioEncontrado = await usuarios.findOne({
        correo: correo,
        usuario: usuario,
      });
      if (usuarioEncontrado) {
        res.status(500).json({
          estado: 0,
          mensaje: "Usuario y/o correo ya existente",
        });
      } else {
        const salt = await bcryptjs.genSalt(8);
        claveEncriptada = await bcryptjs.hash(clave, salt);
        const usuarioCreate = await usuarios.create({
          nombre,
          apellidos,
          usuario,
          correo,
          clave: claveEncriptada, // Add the createdBy field
        });
        if (usuarioCreate) {
          res.status(200).json({
            estado: 1,
            mensaje: "Usuario creado correctamente",
            usuario: usuarioCreate,
          });
        } else {
          res.status(500).json({
            estado: 0,
            mensaje: "Ocurrio un error inesperado",
          });
        }
      }
    }
  } catch (error) {
    res.status(500).json({
      estado: 0,
      mensaje: "Ocurrio un error inesperado",
    });
    console.log(error);
  }
};
