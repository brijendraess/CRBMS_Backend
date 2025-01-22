import {
  SEND_SMS_30_MIN_BEFORE_START,
  SEND_SMS_CANCEL_TEMPLATE,
  SEND_SMS_COMPLETE_TEMPLATE,
  SEND_SMS_EDITED_TEMPLATE,
  SEND_SMS_POSTPONE_TEMPLATE,
  SEND_SMS_SCHEDULED_TEMPLATE,
  SEND_SMS_START_TEMPLATE,
  SEND_SMS_TO_ADMIN_TO_APPROVE_TEMPLATE,
  SEND_SMS_TO_NEW_MEMBER_TEMPLATE,
  USER_OTP_TEMPLATE,
} from "../smsTemplate/smsTemplate.js";
import { replacePlaceholders } from "../utils/emailResponse.js";
import { sendSMS } from "../utils/Sms.js";
import { formatPhoneNumber } from "../utils/utils.js";

const sendSmsOTPHelper = (to, templateValue) => {
  const message = replacePlaceholders(USER_OTP_TEMPLATE, templateValue);
  //const toNumber = formatPhoneNumber(to);
  const toNumber = formatPhoneNumber(process.env.TWILIO_REGISTERED_NUMBER_TO);
  sendSMS(toNumber, message);
};

const sendSmsToAdminForApproveHelper = (to, templateValue) => {
  const message = replacePlaceholders(
    SEND_SMS_TO_ADMIN_TO_APPROVE_TEMPLATE,
    templateValue
  );
  //const toNumber = formatPhoneNumber(to);
  const toNumber = formatPhoneNumber(process.env.TWILIO_REGISTERED_NUMBER_TO);
  sendSMS(toNumber, message);
};

// postpone
const sendSmsPostponeHelper = (to, templateValue) => {
  const message = replacePlaceholders(
    SEND_SMS_POSTPONE_TEMPLATE,
    templateValue
  );
  //const toNumber = formatPhoneNumber(to);
  const toNumber = formatPhoneNumber(process.env.TWILIO_REGISTERED_NUMBER_TO);
  sendSMS(toNumber, message);
};
// meeting cancel
const sendSmsCancelHelper = (to, templateValue) => {
  const message = replacePlaceholders(SEND_SMS_CANCEL_TEMPLATE, templateValue);
  //const toNumber = formatPhoneNumber(to);
  const toNumber = formatPhoneNumber(process.env.TWILIO_REGISTERED_NUMBER_TO);
  sendSMS(toNumber, message);
};

// meeting start before 30 mins
const sendSms30MinBefore = (to, templateValue) => {
  const message = replacePlaceholders(SEND_SMS_30_MIN_BEFORE_START, templateValue);
  //const toNumber = formatPhoneNumber(to);
  const toNumber = formatPhoneNumber(process.env.TWILIO_REGISTERED_NUMBER_TO);
  sendSMS(toNumber, message);
};

// meeting Edit
const sendSmsEditedHelper = (to, templateValue) => {
  const message = replacePlaceholders(SEND_SMS_EDITED_TEMPLATE, templateValue);
  //const toNumber = formatPhoneNumber(to);
  const toNumber = formatPhoneNumber(process.env.TWILIO_REGISTERED_NUMBER_TO);
  sendSMS(toNumber, message);
};
// scheduled
const sendSmsScheduledHelper = (to, templateValue) => {
  const message = replacePlaceholders(
    SEND_SMS_SCHEDULED_TEMPLATE,
    templateValue
  );
  //const toNumber = formatPhoneNumber(to);
  const toNumber = formatPhoneNumber(process.env.TWILIO_REGISTERED_NUMBER_TO);
  sendSMS(toNumber, message);
};

// meeting start
const sendSmsStartHelper = (to, templateValue) => {
  const message = replacePlaceholders(SEND_SMS_START_TEMPLATE, templateValue);
  //const toNumber = formatPhoneNumber(to);
  const toNumber = formatPhoneNumber(process.env.TWILIO_REGISTERED_NUMBER_TO);
  sendSMS(toNumber, message);
};
// meeting complete
const sendSmsCompleteHelper = (to, templateValue) => {
  const message = replacePlaceholders(
    SEND_SMS_COMPLETE_TEMPLATE,
    templateValue
  );
  //const toNumber = formatPhoneNumber(to);
  const toNumber = formatPhoneNumber(process.env.TWILIO_REGISTERED_NUMBER_TO);
  sendSMS(toNumber, message);
};

const sendSmsToNewMemberAdded = (to, templateValue) => {
  const message = replacePlaceholders(SEND_SMS_TO_NEW_MEMBER_TEMPLATE, templateValue);
  //const toNumber = formatPhoneNumber(to);
  const toNumber = formatPhoneNumber(process.env.TWILIO_REGISTERED_NUMBER_TO);
  sendSMS(toNumber, message);
};

export {
  sendSmsOTPHelper,
  sendSmsToAdminForApproveHelper,
  sendSmsPostponeHelper,
  sendSmsCancelHelper,
  sendSmsEditedHelper,
  sendSmsScheduledHelper,
  sendSmsStartHelper,
  sendSmsCompleteHelper,
  sendSms30MinBefore,
  sendSmsToNewMemberAdded
};
