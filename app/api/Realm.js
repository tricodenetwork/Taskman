export function calculateInterval(hours) {
  // Convert hours to milliseconds
  const milliseconds = hours * 60 * 60 * 1000;

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
      console.log("Time interval is over!");
      return;
    }

    // Calculate the remaining hours, minutes, and seconds
    const remainingHours = Math.floor(remainingTime / (60 * 60 * 1000));
    const remainingMinutes = Math.floor(
      (remainingTime % (60 * 60 * 1000)) / (60 * 1000)
    );
    const remainingSeconds = Math.floor((remainingTime % (60 * 1000)) / 1000);

    // Display the remaining time
    console.log(
      `Time left: ${remainingHours}:${remainingMinutes} :${remainingSeconds}`
    );
  }, 1000);
}
