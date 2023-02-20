const getUser = (req, res) => {
  res.status(200).json({ username: "Steven Anongo" });
};

module.exports = { getUser };
