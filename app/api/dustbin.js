useEffect(() => {
  let interval = null;
  // let newTargetTime = Date.now(); // Initialize newTargetTime outside the interval

  function calculateRemainingTime(targetTime) {
    let countDownTimer;
    // Get the current time
    const currentTime = Date.now();

    // Calculate the remaining time in milliseconds

    // countDownTimer = targetTime - currentTime;
    countDownTimer =
      targetTime - millisecondSinceStartDate("2023-06-01T10:03:58.689Z");
    // if (!isWeekend && isAllowedTime) {
    // } else if (isWeekend || !isAllowedTime) {
    //   countDownTimer = task.remainingTime;
    // }

    // Check if the task is completed
    if (item.status == "Completed") {
      clearInterval(interval);
      return;
    }

    console.log("Timer running:", countDownTimer);
    if (isWeekend || !isAllowedTime) {
      realm.write(() => {
        task.remainingTime = countDownTimer;
      });
      clearInterval(interval);
      console.log(countDownTimer, task.countDownTimer);
      return;
    }

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
    setTime(Timer);
  }

  function calculateInterval(duration, inProgress, completedIn) {
    if (!inProgress) {
      return;
    }

    console.log("timer running");
    const { days, hours, minutes } = duration;
    const milliseconds =
      days * 24 * 60 * 60 * 1000 + hours * 60 * 60 * 1000 + minutes * 60 * 1000;

    const startTime = inProgress.getTime();
    // const targetTime = startTime + milliseconds;
    const targetTime = milliseconds;

    // Set up the interval to update the remaining time every second
    interval = setInterval(() => {
      // const newTargetTime = morning + task.remainingTime;
      // // use targetTime only if its a fresh task, else use newTargetTime
      // task.remainingTime == 0
      //   ? calculateRemainingTime(targetTime)
      //   : calculateRemainingTime(newTargetTime);
      calculateRemainingTime(targetTime);
    }, 1000);
  }

  // Call calculateInterval when the component mounts during working hours
  !isWeekend & isAllowedTime &&
    calculateInterval(item.duration, item.inProgress, item.completedIn);
  // !isWeekend & isAllowedTime &&

  // Clear the interval when the component is unmounted
  return () => {
    clearInterval(interval);
  };
}, []);
