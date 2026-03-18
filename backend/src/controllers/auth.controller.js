import User from "../models/user.js";
import { sendEnmail } from "../services/mail.service.js";
import jwt from "jsonwebtoken";

export async function registerUser(req, res) {
  // validation middleware already ensured the required fields are present
  const { username, email, password } = req.body;

  try {
    // check whether user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const user = await User.create({ username, email, password });

    const verifyEmailToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
    );
    await sendEnmail({
      to: email,
      subject: "welcome to perplexity",
      html: `<p>Hi ${username},</p>
      <p>thank you fo rregistering to perplexity</p> 
      <a href=${process.env.BACKEND_URL}/api/auth/verify-email?token=${verifyEmailToken}>click here to verify email</a>
      <p>Best regards <br> the perplexity team</p>`,
    });
    // avoid returning sensitive info
    const userData = {
      id: user._id,
      username: user.username,
      email: user.email,
      verified: user.verified,
      createdAt: user.createdAt,
    };

    res.status(201).json({
      message: "user registered succesfully",
      user: userData,
    });
  } catch (err) {
    console.error("Registration error", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function verifyEmail(req, res) {
  try {
    const token = req.query.token;
    console.log(token);

    if (!token) {
      return res.status(400).json({
        message: "Token not provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    const user = await User.findOne({ email }).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.verified = true;
    await user.save();

    const html = `<h1>email verified succesfully</h1>`;
    res.send(html);
  } catch (error) {
    res.status(400).json({
      message: "Invalid or expired token",
      error: error.message,
    });
  }
}
export async function resendVerifyEmail(req, res) {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({
      message: "user not found",
    });
  }
  const isVerified = user.verified;
  if (isVerified) {
    return res.status(409).json({
      message: "email already verified",
    });
  }

  const verifyEmailToken = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
  );
  try {
    await sendEnmail({
      to: email,
      subject: "welcome to perplexity",
      html: `<p>Hi ${user.username},</p>
        <p>thank you for registering to perplexity</p> 
        <a href=${process.env.BACKEND_URL}/api/auth/verify-email?token=${verifyEmailToken}>click here to verify email</a>
        <p>Best regards <br> the perplexity team</p>`,
    });
  } catch (error) {
    return res.status(400).json({
      message: "error sending email",
    });
  }
  res.status(200).json({
    message: "email sent succesfully",
    user: user.email,
  });
}

export async function loginUser(req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "user doesnt exists" });
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(404).json({ message: "wrong credentials" });
    }

    const isVAlidate = user.verified;
    if (!isVAlidate) {
      return res
        .status(401)
        .json({ message: "please verify email before loggin in" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
    );
    res.cookie("token", token);
    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        verified: user.verified,
      },
    });
  } catch (err) {
    console.error("Login error", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function getUser(req, res) {
  const { email } = req.user;

  const user = await User.findOne({ email }).select("-password");

  if (!user) {
    return res.status(404).json({ message: "user doesnt exists" });
  }

  res.status(200).json({ message: "user fetched succesfully", user });
}
