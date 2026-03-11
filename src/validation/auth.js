import { body, validationResult } from "express-validator";

// common result handler used by both sets of rules
export default function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
}

export const validateRegister = [
  body("username").trim().notEmpty().withMessage("Username is required"),
  body("email").isEmail().withMessage("A valid email address is required"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).*$/,
    )
    .withMessage(
      "Password must include uppercase, lowercase, number, and special character",
    ),
  handleValidation,
];

export const validateLogin = [
  body("email").isEmail().withMessage("A valid email address is required"),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidation,
];
