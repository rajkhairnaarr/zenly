// Simple endpoint to check if the API is working
module.exports = (req, res) => {
  res.json({ message: 'Welcome to Zenly API - Go to /api/auth/register for registration' });
}; 