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

export {generateMD5,formatPhoneNumber,getFormattedDate,formatTimeShort}