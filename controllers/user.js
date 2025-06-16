const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleUserSignup = async (req, res) => {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ error: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({ name, email, password: hashedPassword });
  res.status(201).json({ message: "User created", userId: user._id });
};

const handleUserLogin = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ error: "Invalid credentials" });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

  res.json({ message: "Login successful", token });
};

const handleUserLogout = (req, res) => {
  res.json({ message: "Logout successful" });
};

const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user.userId).select("-password");
  if (!user) return res.status(404).json({ error: "User not found" });

  res.json(user);
};

const updateUser = async (req, res) => {
  const updates = req.body;
  if (updates.password) {
    updates.password = await bcrypt.hash(updates.password, 10);
  }

  const updated = await User.findByIdAndUpdate(req.user.userId, updates, { new: true }).select("-password");
  res.json({ message: "User updated", user: updated });
};

const deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.user.userId);
  res.json({ message: "User deleted" });
};

module.exports = {
  handleUserSignup,
  handleUserLogin,
  handleUserLogout,
  getUserProfile,
  updateUser,
  deleteUser
};
