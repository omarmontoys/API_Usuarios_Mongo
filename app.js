const express = require("express");
const routesUser = require("./src/routes/usuario.routes");
const routesAuth = require("./src/routes/auth.routes");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");
const puerto = process.env.PORT || 3001;
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use("/socios/v1/users", routesUser);
app.use("/socios/v1/users", routesAuth);
app.listen(puerto, () => {
  console.log(
    `Servidor iniciado en el puerto http://localhost:${puerto}/socios/v1/users`
  );
});
