const shortid = require("shortid");
const URL = require("../models/url");

const handleGenerateNewShortURL = async (req, res) => {
  const { url } = req.body;
  const userId = req.user?.userId;

  if (!url) return res.status(400).json({ error: 'URL is required' });

  const shortID = shortid();

  try {
    await URL.create({
      shortId: shortID,
      redirectURL: url,
      visitedHistory: [],
      userId,
    });

    return res.json({ id: shortID });
  } catch (err) {
    return res.status(500).json({ error: "Error generating short URL" });
  }
};

const handleGetShortId = async (req, res) => {
  try {
    const shortId = req.params.shortId;

    // Find the URL entry by shortId
    const entry = await URL.findOne({ shortId });

    if (!entry) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    // Push the visit (timestamp) to the visitedHistory array
    entry.visitedHistory.push({ timestamp: Date.now() });

    // Save the updated entry back to the database
    await entry.save();

    // Redirect to the original URL
    res.redirect(entry.redirectURL);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};

const handleGetAnalytics = async (req, res) => {
  const shortId = req.params.shortId;

  try {
    const result = await URL.findOne({ shortId });

    if (!result) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    return res.json({
      totalClicks: result.visitedHistory.length,  // Total number of visits (clicks)
      analytics: result.visitedHistory,           // Detailed visit history
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error fetching analytics" });
  }
};

module.exports = {
  handleGenerateNewShortURL,
  handleGetAnalytics,
  handleGetShortId,
};
