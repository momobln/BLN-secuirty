// Load environment variables from .env before anything else uses them.
require("dotenv").config();

const path = require("path");
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 3000;

// Keep the allowed browser origin in .env so it can change per deployment.
const frontendOrigin = process.env.FRONTEND_ORIGIN || `http://localhost:${PORT}`;

// CORS blocks browsers from calling this API from unknown websites.
app.use(
  cors({
    origin(origin, callback) {
      // Requests from the same site may not include an Origin header.
      if (!origin || origin === frontendOrigin) {
        return callback(null, true);
      }

      return callback(new Error("This origin is not allowed by CORS."));
    },
  })
);

// Express needs this middleware to read JSON sent by fetch().
app.use(express.json());

// Serve the existing website files from this folder.
app.use(express.static(path.join(__dirname)));

// Basic rate limiting reduces repeated spam submissions from one IP address.
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many contact requests. Please try again later.",
  },
});

function createMailTransporter() {
  // Local development can use Nodemailer's JSON transport when SMTP is not configured.
  // Production should always provide real SMTP settings in .env.
  if (!process.env.SMTP_HOST && process.env.NODE_ENV !== "production") {
    return nodemailer.createTransport({ jsonTransport: true });
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

function validateContactFields(body) {
  const fields = {
    name: String(body.name || "").trim(),
    email: String(body.email || "").trim(),
    phone: String(body.phone || "").trim(),
    service: String(body.service || "").trim(),
    message: String(body.message || "").trim(),
  };

  const missingFields = Object.entries(fields)
    .filter(([, value]) => !value)
    .map(([field]) => field);

  if (missingFields.length > 0) {
    return {
      isValid: false,
      message: `Missing required field(s): ${missingFields.join(", ")}`,
      fields,
    };
  }

  // This is a simple email format check. Your email provider will do deeper validation.
  const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email);
  if (!emailLooksValid) {
    return {
      isValid: false,
      message: "Please enter a valid email address.",
      fields,
    };
  }

  return { isValid: true, fields };
}

app.post("/api/contact", contactLimiter, async (req, res) => {
  const validation = validateContactFields(req.body);

  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      message: validation.message,
    });
  }

  if (!process.env.CONTACT_TO || !process.env.CONTACT_FROM) {
    return res.status(500).json({
      success: false,
      message: "Email settings are not configured on the server.",
    });
  }

  const { name, email, phone, service, message } = validation.fields;
  const transporter = createMailTransporter();

  try {
    await transporter.sendMail({
      from: process.env.CONTACT_FROM,
      to: process.env.CONTACT_TO,
      replyTo: email,
      subject: `New contact request: ${service}`,
      text: [
        "New contact form submission",
        "",
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone}`,
        `Service: ${service}`,
        "",
        "Message:",
        message,
      ].join("\n"),
    });

    return res.status(200).json({
      success: true,
      message: "Your message was sent successfully.",
    });
  } catch (error) {
    console.error("Contact email failed:", error);

    return res.status(500).json({
      success: false,
      message: "The message could not be sent right now. Please try again later.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
