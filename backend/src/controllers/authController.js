const User = require('../models/User'); 
const Driver = require('../models/Driver'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, role, vehicleType, vehiclePlate, vehicleModel, licenseNumber, rcNumber } = req.body;
    const userExists = await User.findOne({ email }) || await Driver.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Email is already registered.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    let account;

    if (role === 'driver') {
      account = new Driver({
        name, email, password: hashedPassword, phone, role: 'driver',
        vehicle: { type: vehicleType || 'Mini', plateNumber: vehiclePlate || '', model: vehicleModel || '' },
        documents: { licenseNumber: licenseNumber || '', rcBookNumber: rcNumber || '', aadhaarNumber: '' },
        verificationStatus: 'pending', isAvailable: false
      });
    } else {
      account = new User({ name, email, password: hashedPassword, phone, role: 'user' });
    }

    await account.save();
    const token = jwt.sign({ id: account._id, role: account.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    account.password = undefined;
    res.status(201).json({ success: true, token, user: account });
  } catch (error) { res.status(500).json({ message: 'Server error during registration', error: error.message }); }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Please provide email and password' });

    let account = await User.findOne({ email }) || await Driver.findOne({ email });
    if (!account) return res.status(404).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: account._id, role: account.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    account.password = undefined;
    res.status(200).json({ success: true, token, user: account });
  } catch (error) { res.status(500).json({ message: 'Server error during login' }); }
};

const getProfile = async (req, res) => {
  try {
    const account = await User.findById(req.user.id).select('-password') || await Driver.findById(req.user.id).select('-password');
    if (!account) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(account);
  } catch (error) { res.status(500).json({ message: 'Server error fetching profile' }); }
};

const updateProfile = async (req, res) => {
  try {
    const { isAvailable, location, name, phone } = req.body;
    const updateFields = {};
    if (isAvailable !== undefined) updateFields.isAvailable = isAvailable;
    if (location) updateFields.location = location;
    if (name) updateFields.name = name;
    if (phone) updateFields.phone = phone;

    let account = await Driver.findByIdAndUpdate(req.user.id, updateFields, { new: true }).select('-password');
    if (!account) account = await User.findByIdAndUpdate(req.user.id, updateFields, { new: true }).select('-password');
    
    res.status(200).json(account);
  } catch (error) { res.status(500).json({ message: 'Server error updating profile' }); }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ message: 'Please provide both passwords.' });

    let account = await User.findById(req.user.id) || await Driver.findById(req.user.id);
    if (!account) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, account.password);
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect.' });

    account.password = await bcrypt.hash(newPassword, 10);
    await account.save();

    res.status(200).json({ success: true, message: 'Password updated successfully.' });
  } catch (error) { res.status(500).json({ message: 'Server error updating password' }); }
};

module.exports = { registerUser, loginUser, getProfile, updateProfile, changePassword };