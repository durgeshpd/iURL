const shortid = require("shortid");
const URL = require("../models/url");

const handleGenerateNewShortURL = async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  const shortID = shortid();

  try {
    await URL.create({
      shortId: shortID,
      redirectURL: url,
      visitedHistory: [],
    });

    return res.json({ id: shortID });
  } catch (err) {
    return res.status(500).json({ error: "Error generating short URL" });
  }
};

const handleGetShortId = async (req, res) => {
  try {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
      { shortId },
      { $push: { visitedHistory: { timestamp: Date.now() } } }
    );

    if (!entry) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    res.redirect(entry.redirectURL);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};

const handleGetAnalytics = async (req, res) => {
  const shortId = req.params.shortId;
  const result = await URL.findOne({ shortId });

  if (!result) {
    return res.status(404).json({ error: "Short URL not found" });
  }

  return res.json({
    totalClicks: result.visitedHistory.length,
    analytics: result.visitedHistory,
  });
};

module.exports = {
  handleGenerateNewShortURL,
  handleGetAnalytics,
  handleGetShortId,
};
