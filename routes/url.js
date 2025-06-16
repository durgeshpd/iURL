const express = require("express");
const { handleGenerateNewShortURL, handleGetAnalytics, handleGetShortId } = require("../controllers/url");

const router = express.Router();

router.post("/", handleGenerateNewShortURL);
router.get("/:shortId", handleGetShortId);
router.get("/analytics/:shortId", handleGetAnalytics);

module.exports = router;
