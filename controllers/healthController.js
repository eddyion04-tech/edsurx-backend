exports.getHealth = (req, res) => {
  res.json({ status: 'ok', message: 'Controller is responding' });
};
