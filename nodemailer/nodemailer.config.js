// nodemailer.config.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// export const transporter = nodemailer.createTransport({
//   service: "gmail", // Or "Yahoo", "Outlook", or another provider
//   auth: {
//     user: process.env.SMTP_EMAIL, // Your Zimbra email
//     pass: process.env.ZIMBRA_PASSWORD, // Your Zimbra email password
//   },
//   tls: {
//     rejectUnauthorized: false, // Use this if you face certificate issues
//   },
// });

export const transporter = nodemailer.createTransport({
  host: "mail.parliament.go.ke", // Replace with your Zimbra mail server
  port: 465, // Use 465 for SSL, or 587 for TLS
  secure: true, // true for port 465, false for 587
  auth: {
    user: process.env.SMTP_EMAIL, // Your Zimbra email
    pass: process.env.ZIMBRA_PASSWORD, // Your Zimbra email password
  },
  tls: {
    rejectUnauthorized: false, // Use this if you face certificate issues
  },
});

// Define your sender's information
export const sender = {
  email: process.env.SMTP_EMAIL,
  name: "CRBMS",
};
