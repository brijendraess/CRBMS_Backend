export const USER_OTP_TEMPLATE = `Hello {name},\n
Your OTP is {otp}. It is valid for {expired} minutes. Please do not share this code with anyone.\n 
- CRBMS`;

export const SEND_SMS_TO_ADMIN_TO_APPROVE_TEMPLATE = `Dear {name},
You have a meeting scheduled for {date} at {startTime}-{endTime}. Please review the details and approve if everything is correct. Contact us for any queries.
- CRBMS`;

export const SEND_SMS_POSTPONE_TEMPLATE=`Dear {name},
The meeting originally scheduled for {date} has been postponed to {startTime}-{endTime}. We apologize for any inconvenience caused. Please confirm your availability.
- CRBMS`

export const SEND_SMS_CANCEL_TEMPLATE=`Hi {name}, 
I’m sorry, but I need to cancel our meeting on {date}  {startTime}-{endTime}. Let me know when you’re available to reschedule. Thanks for understanding!`

export const SEND_SMS_EDITED_TEMPLATE=`Hi {name}, just letting you know that the meeting details have been updated. Contact us for any queries.`

export const SEND_SMS_SCHEDULED_TEMPLATE=`Hi {name}, just a reminder about our meeting scheduled for {date} and {startTime}-{endTime}. Looking forward to catching up!`

export const SEND_SMS_START_TEMPLATE=`Hi {name}, just a heads-up that our meeting is starting in 30 minutes. See you soon!`

export const SEND_SMS_COMPLETE_TEMPLATE=`Hi {name}, thanks for taking the time to meet today. It was great catching up! Let me know if there’s anything else we need to follow up on.`

