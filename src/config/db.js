//Usuario - omarmontoya
//Contraseña - Holamundo1
const mongoose = require("mongoose");
const urilocal = "mongodb://127.0.0.1:27017/tienda";
const uriremota =
  "mongodb+srv://omarmontoya:Holamundo1@clusteromr.mlox5ph.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(uriremota);

module.exports = mongoose;
