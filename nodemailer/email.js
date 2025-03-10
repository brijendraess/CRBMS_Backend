// email.js
import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
} from "../mailTemplate/userEmailTemplate.js";
import { transporter, sender } from "./nodemailer.config.js";

// Send OTP email
export const sendOTP = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: `"${sender.name}" <${sender.email}>`,
      // to: email,
      to: process.env.RECEIVER_EMAIL,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", otp),
    });
    console.log("Verification email sent successfully");
    return true
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error(`Error sending verification email: ${error}`);
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email, resetURL) => {
  try {
    await transporter.sendMail({
      from: `"${sender.name}" <${sender.email}>`,
      // to: email,
      to: process.env.RECEIVER_EMAIL,
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
    });
    console.log("Password reset email sent successfully");
    return true

  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error(`Error sending password reset email: ${error}`);
  }
};

// Send password reset success email
export const sendResetSuccessEmail = async (email) => {
  try {
    await transporter.sendMail({
      from: `"${sender.name}" <${sender.email}>`,
      // to: email,
      to: process.env.RECEIVER_EMAIL,
      subject: "Password Reset Successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
    });
    console.log("Password reset success email sent successfully");
    return true
  } catch (error) {
    console.error("Error sending password reset success email:", error);
    throw new Error(`Error sending password reset success email: ${error}`);
  }
};
