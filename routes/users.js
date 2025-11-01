const express = require("express");
const router = express.Router();
const userController = require("../controllers/users");
const verifyTokenAndAdmin = require("../middleware/verifyTokenAndAdmin");
const verifyToken = require("../middleware/auth");

router.get("/", verifyTokenAndAdmin, userController.getUser);
router.get("/:id", verifyToken, userController.getUniqueUser);
router.post("/", verifyTokenAndAdmin, userController.addUser);
router.put("/:id", verifyToken, userController.editUser);
router.patch("/:id", verifyToken, userController.updateUser);
router.delete("/:id", verifyTokenAndAdmin, userController.deleteUser);


module.exports = router;