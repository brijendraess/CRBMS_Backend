
import axios from "axios";
import { asyncHandler } from "../utils/asyncHandler.js";

async function getAccessTokenMicrosoftCalendar(authCode) {
    const response = await axios.post('https://login.microsoftonline.com/common/oauth2/v2.0/token', new URLSearchParams({
      client_id: process.env.YOUR_CLIENT_ID,
      client_secret: process.env.YOUR_CLIENT_SECRET,
      code: authCode,
      redirect_uri: "http://localhost:5173/callback",
      grant_type: 'authorization_code',
      scope: 'User.Read Calendars.ReadWrite',
    }));
  
    return response.data.access_token;
  }


  async function createEventMicrosoftCalendar(accessToken) {
    const event = {
      subject: "Team Meeting",
      start: { dateTime: "2024-12-23T10:00:00", timeZone: "UTC" },
      end: { dateTime: "2024-12-23T11:00:00", timeZone: "UTC" },
      location: { displayName: "Conference Room A" },
      attendees: [
        {
          emailAddress: { address: "brijendra.tiwari@essindia.com", name: "Brijendra Tiwari" },
          type: "required",
        },
        {
            emailAddress: { address: "suraj.negi@essindia.com", name: "Suraj Negi" },
            type: "required",
          },
      ],
    };
  
    const response = await axios.post('https://graph.microsoft.com/v1.0/me/events', event, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  
    return response.data;
  }


  async function requestAccessTokenMicrosoftOutlook(authCode) {
    const payload = new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: '91a96639-fae5-47d4-b337-30e060d9a0f4',
        client_secret: '3251aa91-708a-4388-974a-58cdb8b19b40',
        redirect_uri: 'http://localhost:9000/api/v1/outlook/all-response',  // Ensure it is correct and absolute
        code: authCode,
    });

    try {
        const response = await axios.post(
            'https://login.microsoftonline.com/e5545c37-4284-45ac-b051-5b78d578c0c3/oauth2/v2.0/token',
            payload.toString(),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );
        console.log('Access Token:', response.data);
    } catch (error) {
        console.error('Error Response:', error.response?.data || error.message);
    }
}

const outlookController = asyncHandler(async (req, res) => {

  
    res.status(200).json({
      success: true,
      message: "Retrieve all outlook response",
    });
  });
  


  export {getAccessTokenMicrosoftCalendar,createEventMicrosoftCalendar,requestAccessTokenMicrosoftOutlook,outlookController}