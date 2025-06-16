const express = require("express");
const {
  handleUserSignup,
  handleUserLogin,
  handleUserLogout,
  getUserProfile,
  updateUser,
  deleteUser,
  getUserUrls,
} = require("../controllers/user");

const authenticateJWT = require("../middlewares/authenticateJWT");

const router = express.Router();

router.post("/signup", handleUserSignup);
router.post("/login", handleUserLogin);
router.post("/logout", handleUserLogout);

router.get("/profile", authenticateJWT, getUserProfile);
router.put("/profile", authenticateJWT, updateUser);
router.delete("/profile", authenticateJWT, deleteUser);

router.get("/urls", authenticateJWT, getUserUrls)

module.exports = router;
