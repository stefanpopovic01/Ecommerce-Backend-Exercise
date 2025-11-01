const User = require("../models/User");

async function getUser (req, res) {
    try {
        const users = await User.find();
        res.json(users);
    }
    catch {
        res.status(500).json({ message: "Greška pri dohvatanju korisnika." });
    }    
}

async function getUniqueUser (req, res) {
    try {
        const user = await User.findById(req.params.id);
        if(!user) return res.status(404).send("Korisnik nije pronadjen. ");
        res.json(user);
    }
    catch (err) {
        res.status(400).send("Nevalidan ID.");
    }
}

async function addUser (req, res) {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } 
    catch (err) {
        res.status(500).json({ message: err.message });
    }    
}

async function editUser (req, res) {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            req.body, 
            {new: true, runValidators: true}
        );
        if(!updatedUser) return res.status(404).json({ message: "Korisnik nije pronađen." });
        res.json(updatedUser);
    }
    catch (err) {
        res.status(400).json({ message: "Greška pri ažuriranju korisnika", error: err.message });        
    }
}

async function updateUser (req, res) {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: req.body }, // samo polja iz body-ja
            { new: true, runValidators: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ message: "Korisnik nije pronađen." });
        }
        res.json(updatedUser);
    }
    catch (err) {
        res.status(400).json({
            message: "Greška pri delimičnom ažuriranju korisnika",
            error: err.message
        });
    }
}

async function deleteUser (req, res) {
    try{
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: "User sa tim ID-om ne postoji." });
        }
        res.status(200).json({ message: "User obrisan.", deletedUser });
    }
    catch (err) {
        res.status(400).json({ message: "Greška pri brisanju korisnika", error: err.message });  
    }
}


module.exports = { getUser, addUser, editUser, getUniqueUser, deleteUser, updateUser };