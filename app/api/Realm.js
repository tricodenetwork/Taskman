function calculateInterval(duration, inProgress, completedIn) {
  // Convert days, hours, and minutes to milliseconds
  if (!inProgress) {
    console.log("Task not yet accepted");
    return;
  }
  const { days, hours, minutes } = duration;
  const milliseconds =
    days * 24 * 60 * 60 * 1000 + hours * 60 * 60 * 1000 + minutes * 60 * 1000;

  // Get the Inprogess time
  const startTime = inProgress.getTime();

  // Calculate the target time by adding the milliseconds to the start time
  const targetTime = startTime + milliseconds;

  // Set up the interval to update the remaining time every second
  const interval = setInterval(() => {
    // Get the current time
    const currentTime = Date.now();

    // Calculate the remaining time in milliseconds
    const remainingTime = targetTime - currentTime;

    // Check if the remaining time is less than or equal to zero
    if (completedIn) {
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
    // console.log(Timer);
    return Timer;
  }, 1000);
}

const dat = new Date(Date.now());

const da = new Date("2023-05-22T14:39:34.527+00:00");
const da2 = new Date("2023-05-29T16:05:29.066+00:00");
// const times = calculateInterval({ days: 2, hours: 20, minutes: 30 }, da2, null);
// calculateInterval(0, 10);
// console.log(da.getTime());
// console.log(times);

// console.log(dat.getMilliseconds() - da.getMilliseconds());

// console.log(new Date("501521"));


export const remainingTimetohours = (remainingTime) => {
  // Calculate the remaining days, hours, minutes, and seconds
  const isElapsed = remainingTime <= 0;
  const remainingDays = Math.floor(
    Math.abs(remainingTime) / (24 * 60 * 60 * 1000)
  );
  const remainingHours = Math.floor(
    (Math.abs(remainingTime) % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)
  );
  const remainingMinutes = Math.floor(
    (Math.abs(remainingTime) % (60 * 60 * 1000)) / (60 * 1000)
  );
  const remainingSeconds = Math.floor(
    (Math.abs(remainingTime) % (60 * 1000)) / 1000
  );

  const sign = isElapsed ? "-" : ""; // Add negative sign if time is elapsed

  // Display the remaining time
  const Timer = `${sign}${remainingDays}d ${remainingHours}h ${remainingMinutes}m ${remainingSeconds}s`;
  return Timer;
};

