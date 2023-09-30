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

  // Add negative sign if time is elapsed

  const isElapsed = countDownTimer <= 0;
  const sign = isElapsed ? "-" : "";

  // set the time variable to display on the UI
  const Timer = `${sign}${remainingDays}d ${remainingHours}h ${remainingMinutes}m`;
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
    if (adjustedStartTimestamp.getUTCHours() < 8) {
    adjustedStartTimestamp.setUTCHours(8, 0, 0, 0); // Set to 8:00 AM
  } else if (adjustedStartTimestamp.getUTCHours() >= 16) {
    adjustedStartTimestamp.setUTCDate(adjustedStartTimestamp.getUTCDate() + 1); // Move to the next day
    adjustedStartTimestamp.setUTCHours(8, 0, 0, 0); // Set to 8:00 AM
  }

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
