function calculateHoursInRange(startDate, holidays = []) {
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

  // Check if the start date is beyond the current date
  if (startTimestamp > currentTimestamp) {
    return totalMillisecondsInRange;
  }

  // Adjust the start time to 8 AM if it's before 8 AM
  const adjustedStartTimestamp = new Date(startTimestamp);
  adjustedStartTimestamp.setUTCHours(8, 0, 0, 0);

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

  const totalHoursInRange = totalMillisecondsInRange / (1000 * 60 * 60); // Convert milliseconds to hours
  return totalHoursInRange.toFixed(2); // Return the result rounded to two decimal places
}

// Usage example:
const specifiedDate = "6/07/2023, 10:00:18 AM"; // Specify the date here
const holidays = ["6/14/2023", "12/25/2023"]; // Specify holidays here (optional)
const hoursInRange = calculateHoursInRange(specifiedDate, holidays);
console.log(hoursInRange);
