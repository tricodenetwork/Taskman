const date = new Date();
date.setHours(8);
date.setMinutes(0);
date.setSeconds(0);
// export const morning = date.getTime();

let countdownInterval;
let startTime; // item.inProgress
let endTime; // targetTime or newTargetTime
let timeLeft; // timeleft for task task.remaining time
let timeSpent; // if it is working hours, then timespent is morning plus Date.now()
let duration;
let completedIn; // startTime + timeSpent

function startCountdown(duration) {
  const totalSeconds =
    duration.d * 24 * 60 * 60 + duration.h * 60 * 60 + duration.m * 60;
  startTime = new Date();
  endTime = new Date(startTime.getTime() + totalSeconds * 1000); // Initially it is startTime plus duration,

  timeLeft = totalSeconds;

  countdownInterval = setInterval(() => {
    const currentTime = new Date();
    const isInTimeRange =
      currentTime.getHours() >= 8 && currentTime.getHours() < 16;

    if (isInTimeRange) {
      const timeDiff = Math.floor((endTime - currentTime) / 1000); // Time difference in seconds
      timeLeft = timeDiff;

      if (timeDiff > 0) {
        const days = Math.floor(timeDiff / (24 * 60 * 60));
        const hours = Math.floor((timeDiff / (60 * 60)) % 24);
        const minutes = Math.floor((timeDiff / 60) % 60);
        const seconds = Math.floor(timeDiff % 60);

        console.log(
          `Countdown: ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`
        );
      } else {
        clearInterval(countdownInterval);
        console.log("Time has elapsed.");
      }
    } else {
      clearInterval(countdownInterval);
      console.log(`Countdown paused. Time remaining: ${timeLeft} seconds`);
    }
  }, 1000); // Update every 1 second
}

// startCountdown({ d: 0, h: 4, m: 0 });

function calculateTimeSince(startDate, startTime) {
  const startDateTime = new Date(`${startDate} ${startTime}`);
  const currentDate = new Date();

  // Check if the start date is on a weekend
  if (startDateTime.getDay() === 6 || startDateTime.getDay() === 0) {
    console.log("Start date falls on a weekend. No working hours.");
    return;
  }

  // Check if the start date is outside working hours
  if (
    startDateTime.getHours() < 8 ||
    startDateTime.getHours() >= 16 ||
    (startDateTime.getHours() === 16 && startDateTime.getMinutes() > 0)
  ) {
    console.log("Start date is outside working hours.");
    return;
  }

  let elapsedTime = currentDate - startDateTime;

  // Subtract weekends from the elapsed time
  const elapsedDays = Math.floor(elapsedTime / (24 * 60 * 60 * 1000));
  const elapsedWeekends =
    Math.floor((elapsedDays + startDateTime.getDay()) / 7) * 2;
  elapsedTime -= elapsedWeekends * 24 * 60 * 60 * 1000;

  // Subtract time outside working hours from the elapsed time
  const startHour = startDateTime.getHours();
  const startMinutes = startDateTime.getMinutes();
  const endHour = 16; // 4 PM
  const endMinutes = 0;

  if (currentDate.getDay() > 0 && currentDate.getDay() < 6) {
    // Check if the current day is a weekday
    const currentHour = currentDate.getHours();
    const currentMinutes = currentDate.getMinutes();

    if (
      currentHour < startHour ||
      (currentHour === startHour && currentMinutes < startMinutes)
    ) {
      console.log("Current time is outside working hours.");
      return;
    }

    if (
      currentHour > endHour ||
      (currentHour === endHour && currentMinutes > endMinutes)
    ) {
      const remainingHours =
        (currentHour - endHour) * 60 + (currentMinutes - endMinutes);
      elapsedTime -= remainingHours * 60 * 1000;
    }
  }

  const days = Math.floor(elapsedTime / (24 * 60 * 60 * 1000));
  const hours = Math.floor((elapsedTime / (60 * 60 * 1000)) % 24);
  const minutes = Math.floor((elapsedTime / (60 * 1000)) % 60);
  const seconds = Math.floor((elapsedTime / 1000) % 60);

  console.log(
    `Time spent since ${startDate} ${startTime}: ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds.`
  );
}

const startDate = "2023-06-2";
const startT = "08:00:00";
// calculateTimeSince(startDate, startT);

function timeSpentz(dateTimeString) {
  const startDate = new Date(dateTimeString);
  const endDate = new Date();
  let hours = 0;
  let minutes = 0;
  let seconds = 0;
  for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
    if (d.getDay() !== 0 && d.getDay() !== 6) {
      if (d.getTime() === startDate.getTime()) {
        const startHour = startDate.getHours();
        if (startHour < 8) {
          hours += 8;
        } else if (startHour >= 16) {
          continue;
        } else {
          hours += 16 - startHour;
          minutes -= startDate.getMinutes();
          seconds -= startDate.getSeconds();
        }
      } else if (d.getTime() === endDate.getTime()) {
        const endHour = endDate.getHours();
        if (endHour < 8) {
          continue;
        } else if (endHour >= 16) {
          hours += 8;
        } else {
          hours += endHour - 8;
          minutes += endDate.getMinutes();
          seconds += endDate.getSeconds();
        }
      } else {
        hours += 8;
      }
    }
  }
  minutes += Math.floor(seconds / 60);
  seconds = seconds % 60;
  hours += Math.floor(minutes / 60);
  minutes = minutes % 60;
  return `{d: ${Math.floor(hours / 24)}, h: ${
    hours % 24
  }, m: ${minutes}, s: ${seconds}}`;
}

// function millisecondSinceStartDate(startDate) {
//   if (!startDate) {
//     return;
//   }

//   const startDateTime = new Date(startDate);
//   const currentDate = new Date();

//   // Check if the start date is on a weekend
//   if (startDateTime.getDay() === 6 || startDateTime.getDay() === 0) {
//     console.log("Start date falls on a weekend. No working hours.");
//     return;
//   }

//   // Check if the start date is outside working hours
//   if (
//     startDateTime.getHours() < 8 ||
//     startDateTime.getHours() >= 16 ||
//     (startDateTime.getHours() === 16 && startDateTime.getMinutes() > 0)
//   ) {
//     console.log(startDate, "Start time is outside working hours.");
//     return;
//   }

//   let elapsedTime = currentDate - startDateTime;

//   // Subtract weekends from the elapsed time
//   const elapsedDays = Math.floor(elapsedTime / (24 * 60 * 60 * 1000));
//   const elapsedWeekends =
//     Math.floor((elapsedDays + startDateTime.getDay()) / 7) * 2;
//   elapsedTime -= elapsedWeekends * 24 * 60 * 60 * 1000;

//   // Subtract time outside working hours from the elapsed time
//   const startHour = 8;
//   const startMinutes = 0;
//   const endHour = 16; // 4 PM
//   const endMinutes = 0;

//   if (currentDate.getDay() > 0 && currentDate.getDay() < 6) {
//     // Check if the current day is a weekday
//     const currentHour = currentDate.getHours();
//     const currentMinutes = currentDate.getMinutes();

//     if (
//       currentHour < startHour ||
//       (currentHour === startHour && currentMinutes < startMinutes)
//     ) {
//       console.log("Current time is outside working hours.");
//       return;
//     }

//     if (
//       currentHour > endHour ||
//       (currentHour === endHour && currentMinutes > endMinutes)
//     ) {
//       const remainingHours =
//         (currentHour - endHour) * 60 + (currentMinutes - endMinutes);
//       elapsedTime -= remainingHours * 60 * 1000;
//     }
//   }

//   return elapsedTime / 3600000;
// }

export function calculateTime(countDownTimer) {
  // Calculate the remaining days, hours, minutes, and seconds

  const remainingDays = Math.floor(
    Math.abs(countDownTimer) / (24 * 60 * 60 * 1000)
  );
  const remainingHours = Math.floor(
    (Math.abs(countDownTimer) % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)
  );
  const remainingMinutes = Math.floor(
    (Math.abs(countDownTimer) % (60 * 60 * 1000)) / (60 * 1000)
  );
  const remainingSeconds = Math.floor(
    (Math.abs(countDownTimer) % (60 * 1000)) / 1000
  );

  // Add negative sign if time is elapsed

  const isElapsed = countDownTimer <= 0;
  const sign = isElapsed ? "-" : "";

  // set the time variable to display on the UI
  const Timer = `${sign}${remainingDays}d ${remainingHours}h ${remainingMinutes}m ${remainingSeconds}s`;
  // console.log(Timer);
  return Timer;
}

export function millisecondSinceStartDate(startDate, holidays = []) {
  if (!startDate) {
    return;
  }
  const start = new Date(startDate);
  const current = new Date();
  let totalMillisecondsInRange = 0;

  // Convert start and current dates to UTC timestamps
  const startTimestamp = Date.UTC(
    start.getUTCFullYear(),
    start.getUTCMonth(),
    start.getUTCDate(),
    start.getUTCHours(),
    start.getUTCMinutes(),
    start.getUTCSeconds(),
    start.getUTCMilliseconds()
  );

  const currentTimestamp = Date.UTC(
    current.getUTCFullYear(),
    current.getUTCMonth(),
    current.getUTCDate(),
    current.getUTCHours(),
    current.getUTCMinutes(),
    current.getUTCSeconds(),
    current.getUTCMilliseconds()
  );

  // Adjust the start time to 8 AM if it's before 8 AM
  const adjustedStartTimestamp = new Date(startTimestamp);
  adjustedStartTimestamp.setUTCHours(7, 0, 0, 0);

  // Calculate the number of milliseconds in a day
  const millisecondsInADay = 24 * 60 * 60 * 1000;

  // Iterate through each day between the start date and current date
  for (
    let timestamp = adjustedStartTimestamp.getTime();
    timestamp <= currentTimestamp;
    timestamp += millisecondsInADay
  ) {
    const date = new Date(timestamp);

    const dayOfWeek = date.getUTCDay();

    // Exclude weekends (Saturday and Sunday)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      // Check if the date is a holiday
      const isHoliday = holidays.some((holiday) => {
        const holidayDate = new Date(holiday);
        return (
          holidayDate.getUTCFullYear() === date.getUTCFullYear() &&
          holidayDate.getUTCMonth() === date.getUTCMonth() &&
          holidayDate.getUTCDate() === date.getUTCDate()
        );
      });

      if (!isHoliday) {
        // Set the start and end times of the workday
        const startOfWorkday = new Date(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate(),
          8,
          0,
          0
        );
        const endOfWorkday = new Date(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate(),
          16,
          0,
          0
        );

        // Check if the start time is beyond the end of the workday
        if (startTimestamp > endOfWorkday.getTime()) {
          continue; // Skip to the next day
        }

        // Calculate the milliseconds within the workday range
        const dayStart = Math.max(startTimestamp, startOfWorkday.getTime());
        const dayEnd = Math.min(currentTimestamp, endOfWorkday.getTime());
        const timeDiff = dayEnd - dayStart;
        totalMillisecondsInRange += Math.max(0, timeDiff);
      }
    }
  }
  return totalMillisecondsInRange;
}

// console.log(millisecondSinceStartDate("2023-06-13T10:14:42.326+00:00"));
