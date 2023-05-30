import moment from "moment";
// import * as MailComposer from "expo-mail-composer";
import { Linking } from "react-native";
import qs from "qs";

export const sendUserDetails = async (recipient, userDetails) => {
  const { name, email, dept, phone, password, role } = userDetails;
  let url = `mailto:${recipient}`;
  console.log(recipient);

  const subject = "Welcome to MyApp"; // Specify the email subject
  const body = `
    Hello ${name},

    Welcome! Your account details are as follows:

    Name:${name}
    Email: ${email}
    Department: ${dept}
    Phone: ${phone}
    Password: ${password}
    Role:${role}

    Thank you for joining!

    Best regards,
    The Team
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
  console.log(canOpen);

  // if (!canOpen) {
  //   throw new Error("Provided URL can not be handled");
  // }

  return Linking.openURL(url);

  // Compose the email
  // MailComposer.composeAsync({
  //   recipients: [recipient],
  //   subject,
  //   body,
  // });
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
  const millisecondsDiff =
    (date1 !== null || date2 !== null) && date1?.getTime() - date2?.getTime();
  const hoursDiff = Math.floor(millisecondsDiff / (1000 * 60 * 60));
  const minutesDiff = Math.floor(
    (millisecondsDiff % (1000 * 60 * 60)) / (1000 * 60)
  );

  return {
    hours: hoursDiff,
    minutes: minutesDiff,
  };
}

// Example usage
const date1 = new Date();
const date2 = new Date("2023-05-22T14:39:34.527+00:00");

const difference = Completed(date1, date2);
console.log(difference.hours, "hours", difference.minutes, "minutes");

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
