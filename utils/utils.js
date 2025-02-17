import crypto from "crypto"
import fs from "fs";

function generateMD5(data) {
    return crypto.createHash('md5').update(data, 'utf8').digest('hex');
}

function generateKey(key) {
  return crypto.createHash('sha256').update(key).digest(); // Ensures 32-byte key
}

function encryptData(data, key){
  const keyBuffer = generateKey(key);
  const cipher = crypto.createCipheriv('aes-256-ecb', keyBuffer, null);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decryptData(encryptData, key){
  const keyBuffer = generateKey(key);
  const decipher = crypto.createDecipheriv('aes-256-ecb', keyBuffer, null);
  let decrypted = decipher.update(encryptData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

function formatPhoneNumber(number) {
    // Remove spaces and unnecessary characters
    const cleanNumber = number.replace(/\s+/g, '');
    
    // Check if the number starts with '+91'
    if (!cleanNumber.startsWith(process.env.PHONE_NUMBER_COUNTRY_CODE)) {
      return process.env.PHONE_NUMBER_COUNTRY_CODE + cleanNumber;
    }
    return cleanNumber;
  }

  const getFormattedDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Add leading zero
    const day = String(today.getDate()).padStart(2, "0"); // Add leading zero
    return `${year}-${month}-${day}`;
  };

  function formatTimeShort(timeString) {
    const [hours, minutes, seconds] = timeString.split(":").map(Number); // Extract hours, minutes, and seconds
    const amPm = hours >= 12 ? "PM" : "AM"; // Determine AM or PM
    const formattedHours = hours % 12 || 12; // Convert to 12-hour format (handle 0 as 12)
  
    return `${String(formattedHours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )} ${amPm}`;
  }

  function getUniqueTopUsers (users) {
    const uniqueUsers = new Map();
    users.sort((a, b) => b.organizerPercentage - a.organizerPercentage);
    for (const user of users) {
        uniqueUsers.set(user.userData.id, user); // Use userData.id as unique key
        if (uniqueUsers.size === 10) break; // Stop once we have 10 unique users
    }
    return Array.from(uniqueUsers.values());
  };

  function getUniqueTopRooms (rooms) {
    const uniqueRooms = new Map();
    rooms.sort((a, b) => b.roomPercentage - a.roomPercentage);
    for (const room of rooms) {
        uniqueRooms.set(room.roomData.id, room); // Use roomData.id as unique key
        if (uniqueRooms.size === 10) break; // Stop once we have 10 unique rooms
    }
    return Array.from(uniqueRooms.values());
};

const parseICSFile = (filePath) => {
  try {
    // Read the .ics file
    const icsData = fs.readFileSync(filePath, "utf-8");

    // Split the content by each event
    const eventBlocks = icsData.split("BEGIN:VEVENT").slice(1);

    // Parse events
    const events = eventBlocks.map((eventBlock) => {
      const eventData = eventBlock.split("\n").map((line) => line.trim());

      const event = {};
      eventData.forEach((line) => {
        if (line.startsWith("UID:")) event.uid = line.replace("UID:", "").trim();
        if (line.startsWith("SUMMARY:")) event.summary = line.replace("SUMMARY:", "").trim();
        if (line.startsWith("DESCRIPTION:")) event.description = line.replace("DESCRIPTION:", "").trim();
        if (line.startsWith("LOCATION:")) event.location = line.replace("LOCATION:", "").trim();
        if (line.startsWith("DTSTART:")) event.startDate = line.replace("DTSTART:", "").trim();
        if (line.startsWith("DTEND:")) event.endDate = line.replace("DTEND:", "").trim();
        if (line.startsWith("STATUS:")) event.status = line.replace("STATUS:", "").trim();
      });

      return event;
    });

    return events;
  } catch (error) {
    console.error("Error reading ICS file:", error);
    return [];
  }
};


export {generateMD5,formatPhoneNumber,getFormattedDate,formatTimeShort, getUniqueTopUsers, getUniqueTopRooms, parseICSFile, encryptData, decryptData}