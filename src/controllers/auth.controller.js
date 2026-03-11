import User from "../models/user.js";
import { sendEnmail } from "../services/mail.service.js";
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

    await sendEnmail({
      to: email,
      subject: "welcome to perplexity",
      html: `<p>Hi ${username},</p>
      <p>thank you fo rregistering to perplexity</p> 
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

// export async function loginUser(req, res) {
//   const { email, password } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     const isMatch = await user.comparePassword(password);
//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     res.json({
//       message: "Login successful",
//       user: {
//         id: user._id,
//         username: user.username,
//         email: user.email,
//         verified: user.verified,
//       },
//     });
//   } catch (err) {
//     console.error("Login error", err);
//     res.status(500).json({ message: "Server error" });
//   }
// }
