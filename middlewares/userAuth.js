import jwt from "jsonwebtoken";

export const userAuth = async (req, res, next) => {
    const token = req.cookies?.jwt;

    if (!token) {
        return res.status(401).json({ success: false, message: "JWT not found in cookie" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.body.userId = decoded.id;
        next(); // Only call next if verification succeeds
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};
