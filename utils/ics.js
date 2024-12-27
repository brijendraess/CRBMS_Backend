import fs from "fs";

const createICSFile = (eventDetails) => {
  const {
    uid,
    dtstamp,
    dtstart,
    dtend,
    summary,
    organizerName,
    organizerEmail,
    description,
    location,
  } = eventDetails;

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
BEGIN:VEVENT
UID:${uid}
DTSTAMP:${dtstamp}
DTSTART:${dtstart}
DTEND:${dtend}
SUMMARY:${summary}
ORGANIZER;CN=${organizerName}:mailto:${organizerEmail}
DESCRIPTION:${description}
LOCATION:${location}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

  const filePath = `./public/ics/room_meeting_${Date.now()}.ics`;
  fs.writeFileSync(filePath, icsContent);
  return { filePath, fileName: `room_meeting_${Date.now()}.ics` };
};

const updateICSFile = (eventDetails) => {
  const {
    uid,
    dtstamp,
    dtstart,
    dtend,
    summary,
    description,
    location,
    sequence,
  } = eventDetails;

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
METHOD:REQUEST
BEGIN:VEVENT
UID:${uid}
DTSTAMP:${dtstamp}
DTSTART:${dtstart}
DTEND:${dtend}
SUMMARY:${summary}
DESCRIPTION:${description}
LOCATION:${location}
SEQUENCE:${sequence}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

  const filePath = `./public/ics/room_meeting_${Date.now()}.ics`;
  fs.writeFileSync(filePath, icsContent);
  return { filePath, fileName: `room_meeting_${Date.now()}.ics` };
};

const postponeICSFile = (eventDetails) => {
  const {
    uid,
    dtstamp,
    dtstart,
    dtend,
    summary,
    description,
    location,
    sequence,
    organizerName,
    organizerEmail,
  } = eventDetails;

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
METHOD:REQUEST
BEGIN:VEVENT
UID:${uid}
DTSTAMP:${dtstamp}
DTSTART:${dtstart}
DTEND:${dtend}
SUMMARY:${summary}
DESCRIPTION:${description}
LOCATION:${location}
ORGANIZER;CN=${organizerName}:mailto:${organizerEmail}
SEQUENCE:${sequence}
STATUS:TENTATIVE
END:VEVENT
END:VCALENDAR`;

  const filePath = `./public/ics/room_meeting_${Date.now()}.ics`;
  fs.writeFileSync(filePath, icsContent);
  return { filePath, fileName: `room_meeting_${Date.now()}.ics` };
};

const cancelledICSFile = (eventDetails) => {
  const {
    uid,
    dtstamp,
    dtstart,
    dtend,
    summary,
    description,
    location,
    sequence,
    organizerName,
    organizerEmail,
  } = eventDetails;

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
METHOD:CANCEL
BEGIN:VEVENT
UID:${uid}
DTSTAMP:${dtstamp}
DTSTART:${dtstart}
DTEND:${dtend}
SUMMARY:${summary}
DESCRIPTION:${description}
LOCATION:${location}
ORGANIZER;CN=${organizerName}:mailto:${organizerEmail}
SEQUENCE:${sequence}
STATUS:CANCELLED
END:VEVENT
END:VCALENDAR`;

  const filePath = `./public/ics/room_meeting_${Date.now()}.ics`;
  fs.writeFileSync(filePath, icsContent);
  return { filePath, fileName: `room_meeting_${Date.now()}.ics` };
};

const formatDateToICS = (date) => {
  const pad = (num) => (num < 10 ? "0" + num : num); // Pad single digits with leading zero

  const year = date.getUTCFullYear();
  const month = pad(date.getUTCMonth() + 1); // Months are 0-based in JS
  const day = pad(date.getUTCDate());
  const hours = pad(date.getUTCHours());
  const minutes = pad(date.getUTCMinutes());
  const seconds = pad(date.getUTCSeconds());

  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
};

const eventMeetingData = (eventData) => {
  const {
    uid,
    meetingDate,
    startTime,
    endTime,
    summary,
    description,
    location,
    organizerName,
    organizerEmail,
  } = eventData;
  const updatedStartDate = `${meetingDate}T${startTime}Z`;
  const updatedEndDate = `${meetingDate}T${endTime}Z`;
  const meetingStartLocalDate = new Date(updatedStartDate);
  const utcMeetingStartDate = new Date(
    meetingStartLocalDate.getTime() +
      meetingStartLocalDate.getTimezoneOffset() * 60000
  );
  const meetingEndLocalDate = new Date(updatedEndDate);
  const utcMeetingEndDate = new Date(
    meetingEndLocalDate.getTime() +
      meetingEndLocalDate.getTimezoneOffset() * 60000
  );
  const eventDetails = {
    uid: uid,
    dtstamp: new Date().toISOString().replace(/[-:.]/g, "").slice(0, 15) + "Z",
    dtstart: formatDateToICS(utcMeetingStartDate), //"20240110T150000Z", // Start time in UTC
    dtend: formatDateToICS(utcMeetingEndDate), //"20240110T160000Z",   // End time in UTC
    summary: summary,
    organizerName: organizerName,
    organizerEmail: organizerEmail,
    description: description,
    location: location,
  };
  return eventDetails;
};

const updateEventMeetingData = (eventData) => {
  const {
    uid,
    meetingDate,
    startTime,
    endTime,
    summary,
    description,
    location,
    sequence,
  } = eventData;
  const updatedStartDate = `${meetingDate}T${startTime}Z`;
  const updatedEndDate = `${meetingDate}T${endTime}Z`;
  const meetingStartLocalDate = new Date(updatedStartDate);
  const utcMeetingStartDate = new Date(
    meetingStartLocalDate.getTime() +
      meetingStartLocalDate.getTimezoneOffset() * 60000
  );
  const meetingEndLocalDate = new Date(updatedEndDate);
  const utcMeetingEndDate = new Date(
    meetingEndLocalDate.getTime() +
      meetingEndLocalDate.getTimezoneOffset() * 60000
  );

  const eventDetails = {
    uid:uid,
    dtstamp:new Date().toISOString().replace(/[-:.]/g, "").slice(0, 15) + "Z",
    dtstart:formatDateToICS(utcMeetingStartDate),
    dtend:formatDateToICS(utcMeetingEndDate),
    summary:summary,
    description:description,
    location:location,
    sequence:sequence,
  };
  return eventDetails;
};

const postponeEventMeetingData = (eventData) => {
  const {
    uid,
    meetingDate,
    startTime,
    endTime,
    summary,
    description,
    location,
    sequence,
    organizerName,
    organizerEmail,
  } = eventData;
  const updatedStartDate = `${meetingDate}T${startTime}Z`;
  const updatedEndDate = `${meetingDate}T${endTime}Z`;
  const meetingStartLocalDate = new Date(updatedStartDate);
  const utcMeetingStartDate = new Date(
    meetingStartLocalDate.getTime() +
      meetingStartLocalDate.getTimezoneOffset() * 60000
  );
  const meetingEndLocalDate = new Date(updatedEndDate);
  const utcMeetingEndDate = new Date(
    meetingEndLocalDate.getTime() +
      meetingEndLocalDate.getTimezoneOffset() * 60000
  );

  const eventDetails = {
    uid:uid,
    dtstamp:new Date().toISOString().replace(/[-:.]/g, "").slice(0, 15) + "Z",
    dtstart:formatDateToICS(utcMeetingStartDate),
    dtend:formatDateToICS(utcMeetingEndDate),
    summary,
    description,
    location,
    sequence,
    organizerName,
    organizerEmail,
  };
  return eventDetails;
};

const cancelledEventMeetingData = (eventData) => {
  const {
    uid,
    meetingDate,
    startTime,
    endTime,
    summary,
    description,
    location,
    sequence,
    organizerName,
    organizerEmail,
  } = eventData;
  const updatedStartDate = `${meetingDate}T${startTime}Z`;
  const updatedEndDate = `${meetingDate}T${endTime}Z`;
  const meetingStartLocalDate = new Date(updatedStartDate);
  const utcMeetingStartDate = new Date(
    meetingStartLocalDate.getTime() +
      meetingStartLocalDate.getTimezoneOffset() * 60000
  );
  const meetingEndLocalDate = new Date(updatedEndDate);
  const utcMeetingEndDate = new Date(
    meetingEndLocalDate.getTime() +
      meetingEndLocalDate.getTimezoneOffset() * 60000
  );

  const eventDetails = {
    uid:uid,
    dtstamp:new Date().toISOString().replace(/[-:.]/g, "").slice(0, 15) + "Z",
    dtstart:formatDateToICS(utcMeetingStartDate),
    dtend:formatDateToICS(utcMeetingEndDate),
    summary,
    description,
    location,
    sequence,
    organizerName,
    organizerEmail,
  };
  return eventDetails;
};

export { createICSFile,updateICSFile,postponeICSFile,cancelledICSFile, formatDateToICS, eventMeetingData,updateEventMeetingData,postponeEventMeetingData,cancelledEventMeetingData };
