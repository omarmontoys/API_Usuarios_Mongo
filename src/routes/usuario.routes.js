const express = require("express");
const router = express.Router();
const userController = require("../controllers/usuario.controller");

router.post("/", userController.getAllUser);
router.get("/:email", userController.getUserByEmail);
router.post("/", userController.addUser);
router.put("/:email", userController.updateUser);
router.delete("/:email", userController.deleteUser);

module.exports = router;
