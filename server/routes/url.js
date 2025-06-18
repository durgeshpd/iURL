const express = require("express");
const { handleGenerateNewShortURL, handleGetAnalytics, handleGetShortId } = require("../controllers/url");
const authenticateJWT = require("../middlewares/authenticateJWT");

const router = express.Router();

router.post("/", authenticateJWT, handleGenerateNewShortURL);

router.get("/:shortId", handleGetShortId);

router.get("/analytics/:shortId", authenticateJWT, handleGetAnalytics);

module.exports = router;
