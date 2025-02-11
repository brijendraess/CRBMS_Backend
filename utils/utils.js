import crypto from "crypto"

function generateMD5(data) {
    return crypto.createHash('md5').update(data, 'utf8').digest('hex');
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

export {generateMD5,formatPhoneNumber,getFormattedDate,formatTimeShort, getUniqueTopUsers, getUniqueTopRooms}