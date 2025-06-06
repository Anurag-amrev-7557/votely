const validateRegister = (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;

  // Check if all required fields are present
  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields'
    });
  }

  // Validate name
  if (name.length < 2 || name.length > 50) {
    return res.status(400).json({
      success: false,
      message: 'Name must be between 2 and 50 characters'
    });
  }

  // Validate email
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address'
    });
  }

  // Validate password
  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 8 characters long'
    });
  }

  // Check for password requirements
  if (!/[A-Z]/.test(password)) {
    return res.status(400).json({
      success: false,
      message: 'Password must contain at least one uppercase letter'
    });
  }
  if (!/[a-z]/.test(password)) {
    return res.status(400).json({
      success: false,
      message: 'Password must contain at least one lowercase letter'
    });
  }
  if (!/[0-9]/.test(password)) {
    return res.status(400).json({
      success: false,
      message: 'Password must contain at least one number'
    });
  }
  if (!/[!@#$%^&*]/.test(password)) {
    return res.status(400).json({
      success: false,
      message: 'Password must contain at least one special character (!@#$%^&*)'
    });
  }

  // Check if passwords match
  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: 'Passwords do not match'
    });
  }

  next();
};

module.exports = validateRegister; 