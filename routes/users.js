const express = require("express");
const router = express.Router();
const userController = require("../controllers/users");
const verifyTokenAndAdmin = require("../middleware/verifyTokenAndAdmin");
const verifyToken = require("../middleware/auth");

router.get("/", userController.getUser);
router.get("/:id", userController.getUniqueUser);
router.post("/", userController.addUser);
router.put("/:id", userController.editUser);
router.patch("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);


module.exports = router;