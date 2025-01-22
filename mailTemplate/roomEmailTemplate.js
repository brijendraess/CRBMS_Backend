export const ROOM_BOOKING_REQUEST_TEMPLATE = `
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Room Booking Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .email-header {
            background-color: #4CAF50;
            color: #ffffff;
            padding: 20px;
            text-align: center;
            font-size: 24px;
        }
        .email-body {
            padding: 20px;
            color: #333333;
        }
        .email-body h2 {
            margin-top: 0;
            color: #4CAF50;
        }
        .email-details {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 4px;
            margin: 15px 0;
        }
        .email-details p {
            margin: 5px 0;
            font-size: 14px;
        }
        .email-footer {
            text-align: center;
            font-size: 12px;
            color: #777777;
            padding: 10px;
        }
        .button {
            display: inline-block;
            background-color: #4CAF50;
            color: #ffffff;
            padding: 10px 15px;
            text-decoration: none;
            border-radius: 4px;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            Room Booking Confirmation
        </div>
        <div class="email-body">
            <h2>Booking Successful!</h2>
            <p>Dear {recipientName},</p>
            <p>Your room booking has been successfully created. Below are the details of your booking:</p>
            <div class="email-details">
                <p><strong>Room Name:</strong> {roomName}</p>
                <p><strong>Date:</strong> {bookingDate}</p>
                <p><strong>Time:</strong> {startTime} - {endTime}</p>
                <p><strong>Location:</strong> {location}</p>
                <p><strong>Organizer:</strong> {organizerName}</p>
                <p><strong>Subject:</strong> {subject}</p>
                <p><strong>Agenda:</strong> {agenda}</p>
                <p><strong>Description:</strong> {notes}</p>
            </div>
        </div>
        <div class="email-footer">
            © 2024 CRBMS. All Rights Reserved.
        </div>
    </div>
</body>
</html>
`;

export const ROOM_BOOKING_POSTPONE_REQUEST_TEMPLATE=`<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Room Booking Rescheduled</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .email-header {
            background-color: #ff9800;
            color: #ffffff;
            padding: 20px;
            text-align: center;
            font-size: 24px;
        }
        .email-body {
            padding: 20px;
            color: #333333;
        }
        .email-body h2 {
            margin-top: 0;
            color: #ff9800;
        }
        .email-details {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 4px;
            margin: 15px 0;
        }
        .email-details p {
            margin: 5px 0;
            font-size: 14px;
        }
        .email-footer {
            text-align: center;
            font-size: 12px;
            color: #777777;
            padding: 10px;
        }
        .button {
            display: inline-block;
            background-color: #ff9800;
            color: #ffffff;
            padding: 10px 15px;
            text-decoration: none;
            border-radius: 4px;
            margin-top: 10px;
        }
        .cancel {
            background-color: #f44336;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            Room Booking Rescheduled
        </div>
        <div class="email-body">
            <h2>Room Booking Rescheduled</h2>
            <p>Dear {recipientName},</p>
            <p>Your room booking has been Rescheduled. Here are the updated Rescheduled:</p>
            <div class="email-details">
                 <p><strong>Room Name:</strong> {roomName}</p>
                <p><strong>Date:</strong> {bookingDate}</p>
                <p><strong>Time:</strong> {startTime} - {endTime}</p>
                <p><strong>Location:</strong> {location}</p>
                <p><strong>Organizer:</strong> {organizerName}</p>
                <p><strong>Subject:</strong> {subject}</p>
                <p><strong>Agenda:</strong> {agenda}</p>
                <p><strong>Description:</strong> {notes}</p>
            </div>
        </div>
        <div class="email-footer">
            © 2024 CRBMS. All Rights Reserved.
        </div>
    </div>
</body>
</html>`

export const ROOM_BOOKING_ORGANIZER_REQUEST_TEMPLATE=`
        <p>Dear {organizerName},</p>
        <p>This is a notification regarding your scheduled meeting, <strong>{roomName}</strong>, originally planned as follows:</p>
        <ul>
          <li><strong>Date:</strong> {bookingDate}</li>
          <li><strong>Start Time:</strong> {startTime}</li>
          <li><strong>End Time:</strong> {endTime}</li>
        </ul>
        <p>It appears that additional time may be needed to cover all discussion points or complete the agenda. You may consider extending the meeting duration to the proposed new end time:</p>
        <ul>
          <li><strong>Proposed New End Time:</strong> {newEndTime}</li>
        </ul>
        <p>Please confirm the extension or adjust the schedule as necessary. If you have any concerns or need assistance, feel free to reach out.</p>
        <p>Thank you for your attention to this matter.</p>
        <p>Best regards,</p>
        <p><strong>Meeting Scheduler System</strong></p>
      `

export const ROOM_BOOKING_UPDATE_REQUEST_TEMPLATE=`<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Room Booking Update</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .email-header {
            background-color: #ff9800;
            color: #ffffff;
            padding: 20px;
            text-align: center;
            font-size: 24px;
        }
        .email-body {
            padding: 20px;
            color: #333333;
        }
        .email-body h2 {
            margin-top: 0;
            color: #ff9800;
        }
        .email-details {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 4px;
            margin: 15px 0;
        }
        .email-details p {
            margin: 5px 0;
            font-size: 14px;
        }
        .email-footer {
            text-align: center;
            font-size: 12px;
            color: #777777;
            padding: 10px;
        }
        .button {
            display: inline-block;
            background-color: #ff9800;
            color: #ffffff;
            padding: 10px 15px;
            text-decoration: none;
            border-radius: 4px;
            margin-top: 10px;
        }
        .cancel {
            background-color: #f44336;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            Room Booking Update
        </div>
        <div class="email-body">
            <h2>Room Booking Update</h2>
            <p>Dear {recipientName},</p>
            <p>Your room booking has been Update. Here are the updated details:</p>
            <div class="email-details">
                 <p><strong>Room Name:</strong> {roomName}</p>
                <p><strong>Date:</strong> {bookingDate}</p>
                <p><strong>Time:</strong> {startTime} - {endTime}</p>
                <p><strong>Location:</strong> {location}</p>
                <p><strong>Organizer:</strong> {organizerName}</p>
                <p><strong>Subject:</strong> {subject}</p>
                <p><strong>Agenda:</strong> {agenda}</p>
                <p><strong>Description:</strong> {notes}</p>
            </div>
        </div>
        <div class="email-footer">
            © 2024 CRBMS. All Rights Reserved.
        </div>
    </div>
</body>
</html>`

export const ROOM_BOOKING_CANCEL_REQUEST_TEMPLATE=`<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Room Booking Cancellation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .email-header {
            background-color: #f44336;
            color: #ffffff;
            padding: 20px;
            text-align: center;
            font-size: 24px;
        }
        .email-body {
            padding: 20px;
            color: #333333;
        }
        .email-body h2 {
            margin-top: 0;
            color: #f44336;
        }
        .email-details {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 4px;
            margin: 15px 0;
        }
        .email-details p {
            margin: 5px 0;
            font-size: 14px;
        }
        .email-footer {
            text-align: center;
            font-size: 12px;
            color: #777777;
            padding: 10px;
        }
        .button {
            display: inline-block;
            background-color: #f44336;
            color: #ffffff;
            padding: 10px 15px;
            text-decoration: none;
            border-radius: 4px;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            Room Booking Cancellation
        </div>
        <div class="email-body">
            <h2>We're Sorry!</h2>
            <p>Dear {recipientName},</p>
            <p>We regret to inform you that your room booking has been canceled. Here are the details:</p>
            <div class="email-details">
                <p><strong>Room Name:</strong> {roomName}</p>
                <p><strong>Date:</strong> {bookingDate}</p>
                <p><strong>Time:</strong> {startTime} - {endTime}</p>
                <p><strong>Location:</strong> {location}</p>
            </div>
            
        </div>
        <div class="email-footer">
            © 2024 CRBMS. All Rights Reserved.
        </div>
    </div>
</body>
</html>`

export const ROOM_BOOKING_PENDING_REQUEST_TEMPLATE=`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pending Room Booking</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #007bff;
            color: #ffffff;
            padding: 10px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .content {
            padding: 20px;
        }
        .footer {
            text-align: center;
            padding: 10px;
            font-size: 12px;
            color: #888888;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            color: #ffffff;
            background-color: #007bff;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
        }
        .button:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h2>Pending Room Booking Notification</h2>
        </div>
        <div class="content">
            <p>Hi <strong>{recipientName}</strong>,</p>
            <p>Your request for booking the room <strong>{roomName}</strong> on <strong>{bookingDate}</strong> is currently pending.</p>
            <p>Details of your request are as follows:</p>
            <ul>
                <li><strong>Room Name:</strong> {roomName}</li>
                <li><strong>Booking Date:</strong> {bookingDate}</li>
                <li><strong>Start Time:</strong> {startTime}</li>
                <li><strong>End Time:</strong> {endTime}</li>
                <li><strong>Location:</strong> {location}</li>
            </ul>
            
        </div>
        <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
`

export const ROOM_BOOKING_SCHEDULED_REQUEST_TEMPLATE=`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Room Booking Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #28a745;
            color: #ffffff;
            padding: 10px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .content {
            padding: 20px;
        }
        .footer {
            text-align: center;
            padding: 10px;
            font-size: 12px;
            color: #888888;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            color: #ffffff;
            background-color: #28a745;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
        }
        .button:hover {
            background-color: #218838;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h2>Room Booking Confirmed</h2>
        </div>
        <div class="content">
            <p>Hi <strong>{recipientName}</strong>,</p>
            <p>Your room booking has been successfully scheduled. Below are the details of your booking:</p>
            <ul>
                <li><strong>Room Name:</strong> {roomName}</li>
                <li><strong>Booking Date:</strong> {bookingDate}</li>
                <li><strong>Start Time:</strong> {startTime}</li>
                <li><strong>End Time:</strong> {endTime}</li>
                <li><strong>Location:</strong> {location}</li>
                <li><strong>Organizer:</strong> {organizerName}</li>
            </ul>
        <div class="footer">
            <p>If you have any questions, feel free to reach out to us.</p>
            <p>This is an automated email, please do not reply.</p>
        </div>
    </div>
</body>
</html>`

export const ROOM_BOOKING_START_REQUEST_TEMPLATE=`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meeting Start Room Booking</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #ffc107;
            color: #ffffff;
            padding: 10px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .content {
            padding: 20px;
        }
        .footer {
            text-align: center;
            padding: 10px;
            font-size: 12px;
            color: #888888;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            color: #ffffff;
            background-color: #ffc107;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
        }
        .button:hover {
            background-color: #e0a800;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h2>Your Room Booking meeting started</h2>
        </div>
        <div class="content">
            <p>Hi <strong>{recipientName}</strong>,</p>
            <p>This is a reminder that your room booking has started. Below are the details of your booking:</p>
            <ul>
                <li><strong>Room Name:</strong> {roomName}</li>
                <li><strong>Booking Date:</strong> {bookingDate}</li>
                <li><strong>Start Time:</strong> {startTime}</li>
                <li><strong>End Time:</strong> {endTime}</li>
                <li><strong>Location:</strong> {location}</li>
                <li><strong>Organizer:</strong> {organizerName}</li>
            </ul>
        <div class="footer">
            <p>If you have any questions, feel free to reach out to us.</p>
            <p>This is an automated email, please do not reply.</p>
        </div>
    </div>
</body>
</html>`

export const ROOM_BOOKING_COMPLETED_REQUEST_TEMPLATE=`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Room Booking Completed</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #17a2b8;
            color: #ffffff;
            padding: 10px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .content {
            padding: 20px;
        }
        .footer {
            text-align: center;
            padding: 10px;
            font-size: 12px;
            color: #888888;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            color: #ffffff;
            background-color: #17a2b8;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
        }
        .button:hover {
            background-color: #138496;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h2>Room Booking Completed</h2>
        </div>
        <div class="content">
            <p>Hi <strong>{recipientName}</strong>,</p>
            <p>We hope your room booking went smoothly. Here are the details of your completed booking:</p>
            <ul>
                <li><strong>Room Name:</strong> {roomName}</li>
                <li><strong>Booking Date:</strong> {bookingDate}</li>
                <li><strong>Start Time:</strong> {startTime}</li>
                <li><strong>End Time:</strong> {endTime}</li>
                <li><strong>Location:</strong> {location}</li>
                <li><strong>Organizer:</strong> {organizerName}</li>
            </ul>
           
        </div>
        <div class="footer">
            <p>We value your feedback and strive to improve your experience.</p>
            <p>This is an automated email, please do not reply.</p>
        </div>
    </div>
</body>
</html>
`

export const MEETING_STARTING_IN_30_MIN = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meeting Reminder</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .email-header {
            background-color: #007bff;
            color: #ffffff;
            padding: 20px;
            text-align: center;
            font-size: 24px;
        }
        .email-body {
            padding: 20px;
            color: #333333;
        }
        .email-body h2 {
            margin-top: 0;
            color: #007bff;
        }
        .email-details {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 4px;
            margin: 15px 0;
        }
        .email-details p {
            margin: 5px 0;
            font-size: 14px;
        }
        .email-footer {
            text-align: center;
            font-size: 12px;
            color: #777777;
            padding: 10px;
        }
        .button {
            display: inline-block;
            background-color: #007bff;
            color: #ffffff;
            padding: 10px 15px;
            text-decoration: none;
            border-radius: 4px;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            Meeting Reminder
        </div>
        <div class="email-body">
            <h2>Your Meeting Starts in 30 Minutes</h2>
            <p>Dear {recipientName},</p>
            <p>This is a friendly reminder that your meeting is scheduled to start in 30 minutes. Below are the meeting details:</p>
            <div class="email-details">
                <p><strong>Meeting Title:</strong> {subject}</p>
                <p><strong>Room Name:</strong> {roomName}</p>
                <p><strong>Date:</strong> {bookingDate}</p>
                <p><strong>Start Time:</strong> {startTime}</p>
                <p><strong>End Time:</strong> {endTime}</p>
                <p><strong>Location:</strong> {location}</p>
            </div>
            <p>If you have any questions or need assistance, please don't hesitate to reach out.</p>
        </div>
        <div class="email-footer">
            © 2024 CRBMS. All Rights Reserved.
        </div>
    </div>
</body>
</html>
`

export const ROOM_MEETING_REQUEST_TEMPLATE = `
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Room Booking Request</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .email-header {
            background-color: #007BFF;
            color: #ffffff;
            padding: 20px;
            text-align: center;
            font-size: 24px;
        }
        .email-body {
            padding: 20px;
            color: #333333;
        }
        .email-body h2 {
            margin-top: 0;
            color: #007BFF;
        }
        .email-details {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 4px;
            margin: 15px 0;
        }
        .email-details p {
            margin: 5px 0;
            font-size: 14px;
        }
        .email-footer {
            text-align: center;
            font-size: 12px;
            color: #777777;
            padding: 10px;
        }
        .button {
            display: inline-block;
            background-color: #007BFF;
            color: #ffffff;
            padding: 10px 15px;
            text-decoration: none;
            border-radius: 4px;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            Room Booking Request
        </div>
        <div class="email-body">
            <h2>Meeting Room Booking Request</h2>
            <p>Dear {name},</p>
            <p>A request has been made for a room booking. Below are the details of the request:</p>
            <div class="email-details">
                <p><strong>Room Name:</strong> {roomName}</p>
                <p><strong>Date:</strong> {bookingDate}</p>
                <p><strong>Time:</strong> {startTime} - {endTime}</p>
                <p><strong>Location:</strong> {location}</p>
                <p><strong>Requested By:</strong> {organizerName}</p>
                <p><strong>Subject:</strong> {subject}</p>
                <p><strong>Agenda:</strong> {agenda}</p>
                <p><strong>Description:</strong> {notes}</p>
            </div>
            <p>Please review this request and confirm if the room can be allocated.</p>
        </div>
        <div class="email-footer">
            © 2024 CRBMS. All Rights Reserved.
        </div>
    </div>
</body>
</html>

`

export const NEW_MEMBER_ADDED = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Credentials Created</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .email-header {
            background-color: #007BFF;
            color: #ffffff;
            padding: 20px;
            text-align: center;
            font-size: 24px;
        }
        .email-body {
            padding: 20px;
            color: #333333;
        }
        .email-body h2 {
            margin-top: 0;
            color: #007BFF;
        }
        .email-details {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 4px;
            margin: 15px 0;
        }
        .email-details p {
            margin: 5px 0;
            font-size: 14px;
        }
        .email-footer {
            text-align: center;
            font-size: 12px;
            color: #777777;
            padding: 10px;
        }
        .button {
            display: inline-block;
            background-color: #007BFF;
            color: #ffffff;
            padding: 10px 15px;
            text-decoration: none;
            border-radius: 4px;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-body">
            <h2>Your Account Credentials</h2>
            <p>Dear {recipientName},</p>
            <p>We’re excited to let you know that your account has been successfully created. Below are your login credentials:</p>
            <div class="email-details">
                <p><strong>Username:</strong> {userName}</p>
                <p><strong>Password:</strong> {password}</p>
            </div>
            <p>You can log in to your account using these credentials.</p>
        </div>
        <div class="email-footer">
            © 2025 All Rights Reserved.
        </div>
    </div>
</body>
</html>
`