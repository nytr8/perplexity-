import jwt from "jsonwebtoken";

export function authUser(req, res, next) {
  // cookie-parser puts parsed cookies on `req.cookies`
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      message: "token not available",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // store user info on the request object for later middleware/controllers
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "unauthorized",
    });
  }
}
