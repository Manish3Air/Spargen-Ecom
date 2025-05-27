const User  = require("../models/User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (_id, role, email) => {
  return jwt.sign({ _id, role, email }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

 const register = async (req, res) => {
  const { name, email, password } = req.body;
  const role = req.body.email === "manishpandey3365@gmail.com" ? "admin" :'user';

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  // console.log('User model is:', User);
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash, role });

    const token = generateToken(user._id, user.role, user.email);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Registration failed:", err);
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};


 const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(user._id, user.role, user.email);
    res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

module.exports = {
  register,
  login,
};

