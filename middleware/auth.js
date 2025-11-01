const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "Nije prosleđen token." });
    }

    const token = authHeader.split(" ")[1]; // Bearer token

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } 
    catch (err) {
        return res.status(401).json({ message: "Nevalidan ili istekao token." });
    }
};
