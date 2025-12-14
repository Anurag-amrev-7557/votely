const auth = (req, res, next) => {
  // MOCK AUTH: Always inject a dummy admin user
  req.user = {
    _id: 'mock_admin_id',
    name: 'Mock Admin',
    email: 'admin@iitbbs.ac.in',
    role: 'admin',
    isVerified: true
  };
  next();
};

module.exports = auth;