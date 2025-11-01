const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function register (req, res) {
    try {
        const { email, name, password } = req.body;

        const userExists = await User.findOne({email});
        if (userExists) return res.status(400).json({ message: "Email već postoji" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ message: "User kreiran!" });
    }
    catch (err) {
        res.status(500).json({ message: "Greska", error: err.message });        
    }
}

async function login (req, res) {
    try{
        const { email, password } = req.body;
        const user = await User.findOne({email});
        if (!user) return res.status(404).json({ message: "User ne postoji" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Pogrešan password" });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
        res.json({ message: "Login uspešan", token });

    }
    catch (err) {
        res.status(500).json({ message: "Greška", error: err.message });       
    }
}

module.exports = { register, login };