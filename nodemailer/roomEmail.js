import { ROOM_BOOKING_CANCEL_REQUEST_TEMPLATE, ROOM_BOOKING_POSTPONE_REQUEST_TEMPLATE, ROOM_BOOKING_REQUEST_TEMPLATE, ROOM_BOOKING_UPDATE_REQUEST_TEMPLATE } from "../mailTemplate/roomEmailTemplate.js";
import { replacePlaceholders } from "../utils/emailResponse.js";
import { transporter, sender } from "./nodemailer.config.js";

export const roomBookingEmail = async (email, emailTemplateValues) => {
  try {
    await transporter.sendMail({
      from: `"${sender.name}" <${sender.email}>`,
      to: email,
      subject: "Room Booking Confirmation",
      html:replacePlaceholders(ROOM_BOOKING_REQUEST_TEMPLATE,emailTemplateValues),
    });
    console.log("Room Booking Confirmation");
  } catch (error) {
    console.error("Error sending room booking confirmation email:", error);
    throw new Error(`Error sending room booking confirmation email: ${error}`);
  }
};

export const roomBookingPostponeEmail = async (email, emailTemplateValues) => {
    try {
      await transporter.sendMail({
        from: `"${sender.name}" <${sender.email}>`,
        to: email,
        subject: "Room Booking Postpone Confirmation",
        html:replacePlaceholders(ROOM_BOOKING_POSTPONE_REQUEST_TEMPLATE,emailTemplateValues),
      });
      console.log("Room Booking Postpone Confirmation");
    } catch (error) {
      console.error("Error sending room booking postpone confirmation email:", error);
      throw new Error(`Error sending room booking postpone confirmation email: ${error}`);
    }
  };

  export const roomBookingUpdateEmail = async (email, emailTemplateValues) => {
    try {
      await transporter.sendMail({
        from: `"${sender.name}" <${sender.email}>`,
        to: email,
        subject: "Room Booking Update Confirmation",
        html:replacePlaceholders(ROOM_BOOKING_UPDATE_REQUEST_TEMPLATE,emailTemplateValues),
      });
      console.log("Room Booking Update Confirmation");
    } catch (error) {
      console.error("Error sending room booking update confirmation email:", error);
      throw new Error(`Error sending room booking update confirmation email: ${error}`);
    }
  };

  export const roomBookingCancelEmail = async (email, emailTemplateValues) => {
    try {
      await transporter.sendMail({
        from: `"${sender.name}" <${sender.email}>`,
        to: email,
        subject: "Room Cancel Confirmation",
        html:replacePlaceholders(ROOM_BOOKING_CANCEL_REQUEST_TEMPLATE,emailTemplateValues),
      });
      console.log("Room Cancel Confirmation");
    } catch (error) {
      console.error("Error sending room booking cancel confirmation email:", error);
      throw new Error(`Error sending room booking cancel confirmation email: ${error}`);
    }
  };
