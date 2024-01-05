const bcrypt = require("bcryptjs");
const Usuario = require("../models/usuario.model");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

exports.getAllUser = async (req, res) => {
  try {
    // Get the user ID from the JWT token
    //const token = req.cookies.jwt; // retrieving the token from cookies
    const { token } = req.body; // retrieving the token from body
    // Check if the JWT token is present
    if (!token) {
      return res.status(401).json({
        estado: 0,
        mensaje: "Unauthorized: JWT token missing",
      });
    }
    console.log(token);
    // Verify the JWT token
    const decodedToken = jwt.verify(token, process.env.TOKEN_ACCESS);
    const loggedInUserId = decodedToken.id;
    const loggedInUserEmail = decodedToken.correo;
    const listadoUsuarios = await Usuario.find({
      createdBy: loggedInUserEmail,
    }).exec();
    console.log(loggedInUserEmail);
    if (listadoUsuarios) {
      res.status(200).json({
        estado: 1,
        mensaje: "Usuarios encontrados",
        usuarios: listadoUsuarios,
      });
    } else {
      res.status(404).json({
        estado: 0,
        mensaje: "Usuarios no encontrados",
        usuarios: [],
      });
    }
  } catch (error) {
    res.status(500).json({
      estado: 0,
      mensaje: "Ocurrio un error inesperado",
      usuarios: [],
    });
    console.log(error);
  }
};

exports.getAll = async (req, res) => {
  try {
    const listadoUsuarios = await Usuario.find();
    if (listadoUsuarios) {
      res.status(200).json({
        estado: 1,
        mensaje: "Usuarios encontrados",
        usuarios: listadoUsuarios,
      });
    } else {
      res.status(404).json({
        estado: 0,
        mensaje: "Usuarios no encontrados",
        usuarios: [],
      });
    }
  } catch (error) {
    res.status(500).json({
      estado: 0,
      mensaje: "Ocurrio un error inesperado",
      usuarios: [],
    });
  }
};
exports.getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const usuario = await Usuario.findOne({ correo: email }).exec();
    if (email == undefined) {
      res.status(400).json({
        estado: 0,
        mensaje: "BAD REQUEST",
      });
    } else {
      if (usuario) {
        res.status(200).json({
          estado: 1,
          mensaje: "Usuario encontrado",
          usuarios: [usuario],
        });
      } else {
        res.status(500).json({
          estado: 0,
          mensaje: "Usuario no encontrado",
          usuarios: [],
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      estado: 0,
      mensaje: "Ocurrio un error inesperado",
      usuarios: [],
    });
  }
};

exports.addUser = async (req, res) => {
  try {
    const { nombre, apellidos, usuario, correo, clave, token } = req.body;
    // Get the user ID from the JWT token
    //const token = req.cookies.jwt; // retrieving the token from cookies
    // const { } = req.body; // retrieving the token from body
    // Check if the JWT token is present
    if (!token) {
      return res.status(401).json({
        estado: 0,
        mensaje: "Unauthorized: JWT token missing",
      });
    }

    // Verify the JWT token
    const decodedToken = jwt.verify(token, process.env.TOKEN_ACCESS);
    const loggedInUserId = decodedToken.id;
    const loggedInUserEmail = decodedToken.correo;
    if (
      nombre == undefined ||
      apellidos == undefined ||
      usuario == undefined ||
      correo == undefined ||
      clave == undefined
    ) {
      res.status(400).json({
        estado: 0,
        mensaje: "BAD REQUEST",
      });
    } else {
      const usuarioEncontrado = await Usuario.findOne({
        correo: correo,
        usuario: usuario,
      });
      if (usuarioEncontrado) {
        res.status(500).json({
          estado: 0,
          mensaje: "Usuario y/o correo ya existente",
        });
      } else {
        //Falta encriptar clave
        //Falta verificar si el usuario o correo ya existe
        const salt = await bcrypt.genSalt(8);
        claveEncriptada = await bcrypt.hash(clave, salt);
        const usuarioCreate = await Usuario.create({
          nombre,
          apellidos,
          usuario,
          correo,
          clave: claveEncriptada,
          createdBy: loggedInUserEmail, // Add the createdBy field
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

exports.updateUser = async (req, res) => {
  try {
    const { email } = req.params;
    const { nombre, apellidos, clave } = req.body;
    const usuarioEncontrado = await Usuario.findOne({
      correo: email,
    });
    if (email == undefined) {
      res.status(400).json({
        estado: 0,
        mensaje: "BAD REQUEST",
      });
    } else {
      if (usuarioEncontrado) {
        const salt = await bcrypt.genSalt(8);
        claveEncriptada = await bcrypt.hash(clave, salt);
        const usuarioUpdate = await usuarioEncontrado.updateOne({
          nombre,
          apellidos,
          clave: claveEncriptada,
        });
        if (usuarioUpdate) {
          res.status(200).json({
            estado: 1,
            mensaje: "Usuario actualizado correctamente",
          });
        } else {
          res.status(500).json({
            estado: 0,
            mensaje: "Ocurrio un error inesperado",
          });
        }
      } else {
        res.status(500).json({
          estado: 0,
          mensaje: "Usuario no encontrado",
        });
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

exports.deleteUser = async (req, res) => {
  try {
    const { email } = req.params;
    const usuario = await Usuario.findOne({ correo: email }).exec();
    if (usuario) {
      await Usuario.deleteOne(usuario);
      res.status(200).json({
        estado: 1,
        mensaje: "Usuario eliminado correctamente",
        usuario: [],
      });
    } else {
      res.status(404).json({
        estado: 0,
        mensaje: "Usuario no encontrado",
        usuario: [],
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      estado: 0,
      mensaje: "Ocurrio un error inesperado",
      usuario: [],
    });
  }
};
