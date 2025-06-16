const express = require("express");
const { handleGenerateNewShortURL, handleGetAnalytics, handleGetShortId } = require("../controllers/url");
const authenticateJWT = require("../middlewares/authenticateJWT"); // Assuming this is where your middleware is located

const router = express.Router();

// Protected route: Only authenticated users can generate new short URLs
router.post("/", authenticateJWT, handleGenerateNewShortURL);

// Public route: Anyone can access short URL
router.get("/:shortId", handleGetShortId);

// Protected route: Only authenticated users can access analytics for their short URL
router.get("/analytics/:shortId", authenticateJWT, handleGetAnalytics);

module.exports = router;
