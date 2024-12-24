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
            <p>If you want join the meeting, please use the link below:</p>
            <a href="{meetingURL}" class="button">Join Meeting</a>
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
    <title>Room Booking Postponed</title>
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
            Room Booking Postponed
        </div>
        <div class="email-body">
            <h2>Room Booking Postponed</h2>
            <p>Dear {recipientName},</p>
            <p>Your room booking has been postponed. Here are the updated postponed:</p>
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
             <p>If you want join the meeting, please use the link below:</p>
            <a href="{meetingURL}" class="button">Join Meeting</a>
        </div>
        <div class="email-footer">
            © 2024 CRBMS. All Rights Reserved.
        </div>
    </div>
</body>
</html>`

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
             <p>If you want join the meeting, please use the link below:</p>
            <a href="{meetingURL}" class="button">Join Meeting</a>
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