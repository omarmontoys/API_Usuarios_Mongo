const mongoose = require("../config/db");
const { Schema } = mongoose;

//Estrucutura de la coleccion de usuarios
const usurioSchema = new Schema({
  nombre: {
    type: String,
  },
  apellidos: {
    type: String,
  },
  usuario: {
    type: String,
    unique: true,
  },
  correo: {
    type: String,
    unique: true,
  },
  clave: {
    type: String,
    unique: true,
  },
  createdBy: {
    type: String,
    ref: "Usuario",
  },
});

//Correspondecia de la coleccion en la base de datos
const Usuario = mongoose.model("Usuario", usurioSchema);

module.exports = Usuario;
