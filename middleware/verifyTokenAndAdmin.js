const jwt = require("jsonwebtoken");

function verifyTokenAndAdmin (req, res, next) {
  const authHeader = req.headers.token;
  if (!authHeader) return res.status(401).json({ message: "Nema tokena." });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Nevalidan token." });
    if (user.role !== "admin") return res.status(403).json({ message: "Samo admin." });
    req.user = user;
    next();
  });
}

module.exports = verifyTokenAndAdmin;
