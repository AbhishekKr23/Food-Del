import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// Create JWT Token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Login User
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log("Login Request Body:", req.body);

        if (!email || !password) {
            return res.json({ success: false, message: "Email and password are required" });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User doesn't exist." });
        }

        console.log("User Found:", user);

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const token = createToken(user._id);
        return res.json({ success: true, token });
    } catch (error) {
        console.error("Login Error:", error);
        return res.json({ success: false, message: "Error" });
    }
};


// Register User
const registerUser = async (req, res) => {
    const { name, password, email } = req.body;

    try {
        console.log("Register Request Body:", req.body);

        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists." });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email." });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        console.log("Hashed Password:", hashedPassword);

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
        });

        const user = await newUser.save();
        const token = createToken(user._id);

        return res.json({ success: true, token });
    } catch (error) {
        console.error("Register Error:", error);
        return res.json({ success: false, message: "Error" });
    }
};

export { loginUser, registerUser };
