import moment from "moment";
// import * as MailComposer from "expo-mail-composer";
import { Linking } from "react-native";
import qs from "qs";

export const sendUserDetails = async (recipient, userDetails) => {
  const { name, email, dept, phone, password, role } = userDetails;
  let url = `mailto:${recipient}`;

  const subject = "Welcome to Taskman"; // Specify the email subject
  const body = `
    Hello ${name},

    Welcome! Your account details are as follows:

    **Name:** ${name}
    **Password:** ${password}
    **Email:** ${email}
    **Department:** ${dept}
    **Phone:** ${phone}
    **Role:** ${role}

    Kindly download the app from the link below:
    [Download Taskman](https://drive.google.com/file/d/1cc6dEUyppHAASVgc0E5NSsSAdccz8Yug/view?usp=sharing)
    
    Thank you for joining!

    Best regards,
    The Taskman Team
  `;
  // Create email link query
  const query = qs.stringify({
    subject: subject,
    body: body,
  });

  if (query.length) {
    url += `?${query}`;
  }

  // check if we can use this link
  const canOpen = await Linking.canOpenURL(url);

  return Linking.openURL(url);
};

export const sendClientDetails = async (recipient, userDetails) => {
  const { matno, email, password } = userDetails;
  let url = `mailto:${recipient}`;

  const subject = "Welcome to Taskman"; // Specify the email subject
  const body = `
    Hello ${matno},

    Welcome to Taskman! Your account details are as follows:

    **Email:** ${email}
    **Password:** ${password}
  
    Kindly download the app from the link below:
    [Download Taskman](https://drive.google.com/file/d/1cc6dEUyppHAASVgc0E5NSsSAdccz8Yug/view?usp=sharing)

    Thank you for joining!

    Best regards,
    The Taskman Team
  `;
  // Create email link query
  const query = qs.stringify({
    subject: subject,
    body: body,
  });

  if (query.length) {
    url += `?${query}`;
  }

  // check if we can use this link
  const canOpen = await Linking.canOpenURL(url);

  return Linking.openURL(url);
};

export function generatePassword(length) {
  var charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
  var password = "";
  for (var i = 0; i < length; i++) {
    var randomIndex = Math.floor(Math.random() * charset.length);
    password += charset.charAt(randomIndex);
  }
  return password;
}

export function Completed(date1, date2) {
  if (date1 == null || date2 == null) {
    return;
  }

  const millisecondsDiff = Math.abs(date1.getTime() - date2.getTime());
  const daysDiff = Math.floor(millisecondsDiff / (1000 * 60 * 60 * 24));
  const hoursDiff = Math.floor(millisecondsDiff / (1000 * 60 * 60)) % 24;
  const minutesDiff = Math.floor(millisecondsDiff / (1000 * 60)) % 60;

  const formatTimeUnit = (value, unit) => {
    return `${value}${unit}`;
  };

  const formattedTime = `${formatTimeUnit(daysDiff, "d")} ${formatTimeUnit(
    hoursDiff,
    "h"
  )} ${formatTimeUnit(minutesDiff, "m")}`;

  return formattedTime;
}

// Example usage
const date1 = new Date("2023-05-20T14:39:34.527+00:00");
const date2 = new Date("2023-05-22T14:39:34.527+00:00");

const date = moment(); // Assuming you want the current date
export const formattedDate = date.format("dddd, D MMM YYYY");

export function sumFieldbad(array, fieldName) {
  let totalDays = 0;
  let totalHours = 0;
  let totalMinutes = 0;

  array.forEach((obj) => {
    if (
      fieldName in obj &&
      typeof obj[fieldName] === "object" &&
      typeof obj[fieldName].days === "number" &&
      typeof obj[fieldName].hours === "number" &&
      typeof obj[fieldName].minutes === "number"
    ) {
      const { days, hours, minutes } = obj[fieldName];
      totalDays += days;
      totalHours += hours;
      totalMinutes += minutes;
    }
  });

  totalHours += Math.floor(totalMinutes / 60);
  totalMinutes %= 60;
  totalDays += Math.floor(totalHours / 24);
  totalHours %= 24;

  return { days: totalDays, hours: totalHours, minutes: totalMinutes };
}

export function sumField(array, fieldName) {
  return array.reduce(
    (total, obj) => {
      if (fieldName in obj && typeof obj[fieldName] === "object") {
        const { days = 0, hours = 0, minutes = 0 } = obj[fieldName];
        total.days += days;
        total.hours += hours;
        total.minutes += minutes;
      }
      return total;
    },
    { days: 0, hours: 0, minutes: 0 }
  );
}
export function formatDuration(duration) {
  const days = Math.floor(duration / (24 * 60));
  const hours = Math.floor((duration % (24 * 60)) / 60);
  const minutes = duration % 60;
  return { days, hours, minutes };
}
export function convertToMinutes(duration) {
  const { days = 0, hours = 0, minutes = 0 } = duration;

  // Convert null values to zeros
  const normalizedDays = days !== null && !isNaN(days) ? days : 0;
  const normalizedHours = hours !== null && !isNaN(hours) ? hours : 0;
  const normalizedMinutes = minutes !== null && !isNaN(minutes) ? minutes : 0;

  // Convert to minutes
  const totalMinutes =
    normalizedDays * 24 * 60 + normalizedHours * 60 + normalizedMinutes;

  return totalMinutes;
}

export async function sendPushNotification(
  expoPushToken,
  title = "New Task",
  body = "You have just been assigned a new task!"
) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: title,
    body: body,
    data: { someData: "goes here" },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}
export function objectIdToDate(objectId) {
  // Extract the timestamp from the ObjectId
  const timestampHex = objectId.substring(0, 8);
  const timestamp = parseInt(timestampHex, 16) * 1000;

  // Convert to Date
  return new Date(timestamp);
}
export function formatDate(date) {
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const dateOfMonth = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear().toString().slice(2, 4);
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "pm" : "am";

  if (hours > 12) hours -= 12;
  if (hours === 0) hours = 12;

  return `${dateOfMonth}/${month}/${year} ${hours}:${minutes}${ampm}`;
}
