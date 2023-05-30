function calculateInterval(days, hours, minutes) {
  // Convert days, hours, and minutes to milliseconds
  const milliseconds =
    days * 24 * 60 * 60 * 1000 + hours * 60 * 60 * 1000 + minutes * 60 * 1000;

  // Get the current time
  const startTime = Date.now();

  // Calculate the target time by adding the milliseconds to the start time
  const targetTime = startTime + milliseconds;

  // Set up the interval to update the remaining time every second
  const interval = setInterval(() => {
    // Get the current time
    const currentTime = Date.now();

    // Calculate the remaining time in milliseconds
    const remainingTime = targetTime - currentTime;

    // Check if the remaining time is less than or equal to zero
    if (remainingTime <= 0) {
      clearInterval(interval);
      console.log("A Task has just been Completed!");
      return;
    }

    // Calculate the remaining days, hours, minutes, and seconds
    const remainingDays = Math.floor(remainingTime / (24 * 60 * 60 * 1000));
    const remainingHours = Math.floor(
      (remainingTime % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)
    );
    const remainingMinutes = Math.floor(
      (remainingTime % (60 * 60 * 1000)) / (60 * 1000)
    );
    const remainingSeconds = Math.floor((remainingTime % (60 * 1000)) / 1000);

    // Display the remaining time
    const Timer = `${remainingDays}d ${remainingHours}h ${remainingMinutes}m ${remainingSeconds}s`;
    console.log(Timer);
  }, 1000);
}

const dat = new Date(Date.now());

const da = new Date("2023-05-22T14:39:34.527+00:00");
const da2 = new Date("2023-05-23T16:05:29.066+00:00");
// calculateInterval(4, 2);
// calculateInterval(0, 10);

// console.log(dat.getMilliseconds() - da.getMilliseconds());

// console.log(new Date("501521"));
