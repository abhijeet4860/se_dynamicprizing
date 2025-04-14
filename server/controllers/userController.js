const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.registerUser = async (req, res) => {
    const { name, email, password, mobileNumber, pinCode, role } = req.body;

    try {
        // Check if the user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            name,
            email,
            password,
            mobileNumber,
            pinCode
        });

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        console.log(user)
        
        // Save the user
        await user.save();

        // Create and return the JWT token
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, 'your_jwt_secret', { expiresIn: 360000 }, (err, token) => {
            if (err) throw err;
            res.json({ token, email, role });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');   
    }
};


exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }
        console.log(user)

        // Compare the password
        const isMatch = await bcrypt.compare(password, user.password);
        const salt = await bcrypt.genSalt(10);
        const newpassword = await bcrypt.hash(password, salt);
        console.log(newpassword)
        console.log(user.password)
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // Create and return the JWT token and user's email
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, 'your_jwt_secret', { expiresIn: 360000 }, (err, token) => {
            if (err) throw err;
            res.json({ token, email }); // Sending email along with token
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getUserData = async (req, res) => {
    // Extract the token from the request headers
    const token = req.header('x-auth-token');

    // Check if token exists
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, 'your_jwt_secret');

        // Extract user ID from decoded token
        const userId = decoded.user.id;

        // Fetch user details from the database using the user ID
        const user = await User.findById(userId).select('-password'); // Exclude password from the response

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Return the user details
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
// exports.getEmail = async (req, res) => {
//     try {
//         // Find the user by ID
//         const user = await User.findById(req.params.userId);
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }
  
//         // Return the email address
//         res.json({ email: user.email });
//     } catch (error) {
//         console.error('Error fetching user email:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
//   };