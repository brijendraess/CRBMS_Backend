
import fs from "fs";
import { ROOM_BOOKING_CANCEL_REQUEST_TEMPLATE, ROOM_BOOKING_COMPLETED_REQUEST_TEMPLATE, ROOM_BOOKING_START_REQUEST_TEMPLATE, ROOM_BOOKING_ORGANIZER_REQUEST_TEMPLATE, ROOM_BOOKING_PENDING_REQUEST_TEMPLATE, ROOM_BOOKING_POSTPONE_REQUEST_TEMPLATE, ROOM_BOOKING_REQUEST_TEMPLATE, ROOM_BOOKING_SCHEDULED_REQUEST_TEMPLATE, ROOM_BOOKING_UPDATE_REQUEST_TEMPLATE } from "../mailTemplate/roomEmailTemplate.js";
import { replacePlaceholders } from "../utils/emailResponse.js";
import { cancelledICSFile, createICSFile, postponeICSFile, updateICSFile } from "../utils/ics.js";
import { transporter, sender } from "./nodemailer.config.js";

export const roomBookingEmail = async (eventDetails,email, emailTemplateValues) => {
  try {
    const {filePath,fileName} = createICSFile(eventDetails);
    await transporter.sendMail({
      from: `"${sender.name}" <${sender.email}>`,
      to: email,
      subject: "Room Booking Confirmation",
      html:replacePlaceholders(ROOM_BOOKING_REQUEST_TEMPLATE,emailTemplateValues),
      icalEvent: {
        filename: fileName,
        method: "REQUEST",
        content: fs.readFileSync(filePath),
      },
    });
    fs.unlinkSync(filePath); // Clean up the .ics file
  } catch (error) {
    console.error("Error sending room booking confirmation email:", error);
    throw new Error(`Error sending room booking confirmation email: ${error}`);
  }
};

export const roomBookingPostponeEmail = async (eventDetails,email, emailTemplateValues) => {
    try {
      const {filePath,fileName} = postponeICSFile(eventDetails);
      await transporter.sendMail({
        from: `"${sender.name}" <${sender.email}>`,
        to: email,
        subject: "Room Booking Postpone Confirmation",
        html:replacePlaceholders(ROOM_BOOKING_POSTPONE_REQUEST_TEMPLATE,emailTemplateValues),
        attachments: [{
          filename: fileName,
          path: filePath,
        }],
      });
      console.log("Room Booking Postpone Confirmation");
    } catch (error) {
      console.error("Error sending room booking postpone confirmation email:", error);
      throw new Error(`Error sending room booking postpone confirmation email: ${error}`);
    }
  };

  export const roomBookingUpdateEmail = async (eventDetails,email, emailTemplateValues) => {
    try {
      const {filePath,fileName} = updateICSFile(eventDetails);
      await transporter.sendMail({
        from: `"${sender.name}" <${sender.email}>`,
        to: email,
        subject: "Room Booking Update Confirmation",
        html:replacePlaceholders(ROOM_BOOKING_UPDATE_REQUEST_TEMPLATE,emailTemplateValues),
        attachments: [
          {
          filename: fileName,
          path: filePath,
        }],
      });
    } catch (error) {
      console.error("Error sending room booking update confirmation email:", error);
      throw new Error(`Error sending room booking update confirmation email: ${error}`);
    }
  };

  export const roomBookingOrganizerEmail = async (email, emailTemplateValues) => {
    try {
      await transporter.sendMail({
        from: `"${sender.name}" <${sender.email}>`,
        to: email,
        subject: `Action Required: Extend Meeting "${roomName}"`,
        html:replacePlaceholders(ROOM_BOOKING_ORGANIZER_REQUEST_TEMPLATE,emailTemplateValues),
      });
    } catch (error) {
      console.error("Error sending organizer to extend the meeting confirmation email:", error);
      throw new Error(`Error sending organizer to extend the meeting confirmation email: ${error}`);
    }
  };

  export const roomBookingChangeStatusEmail = async (eventDetails,email, emailTemplateValues,meetingStatus) => {
    let templateName='';
    if(meetingStatus==='pending'){
      templateName=ROOM_BOOKING_PENDING_REQUEST_TEMPLATE;
    }else if(meetingStatus==='scheduled'){
      templateName=ROOM_BOOKING_SCHEDULED_REQUEST_TEMPLATE;
    }else if(meetingStatus==='start'){
      templateName=ROOM_BOOKING_START_REQUEST_TEMPLATE;
    }else if(meetingStatus==='completed'){
      templateName=ROOM_BOOKING_COMPLETED_REQUEST_TEMPLATE;
    }else if(meetingStatus==='cancelled'){
      templateName=ROOM_BOOKING_CANCEL_REQUEST_TEMPLATE;
    }
    try {
      let transporterData='';
      if(meetingStatus==='cancelled'){
      const {filePath,fileName} = cancelledICSFile(eventDetails);
      transporterData={
        from: `"${sender.name}" <${sender.email}>`,
        to: email,
        subject: `Room ${meetingStatus} Confirmation`,
        html:replacePlaceholders(templateName,emailTemplateValues),
        attachments: [{
          filename: fileName,
          path: filePath,
        }],
      }
    }else if(meetingStatus==='scheduled'){
      const {filePath,fileName} = createICSFile(eventDetails);
      transporterData={
        from: `"${sender.name}" <${sender.email}>`,
        to: email,
        subject: `Room Booking Confirmation`,
        html:replacePlaceholders(templateName,emailTemplateValues),
        attachments: [{
          filename: fileName,
          path: filePath,
        }],
      }
      }else{
        transporterData={
          from: `"${sender.name}" <${sender.email}>`,
          to: email,
          subject: `Room ${meetingStatus} Confirmation`,
          html:replacePlaceholders(templateName,emailTemplateValues),
        }
      }
      transporter.sendMail(transporterData);
    } catch (error) {
      console.error(`Error sending room booking ${meetingStatus} confirmation email:`, error);
      throw new Error(`Error sending room booking ${meetingStatus} confirmation email: ${error}`);
    }
  };
