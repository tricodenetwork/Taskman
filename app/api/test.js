const tasks = [
  {
    handler: "Handler1",
    duration: { days: 1, hours: 2, minutes: 30 },
    completedIn: new Date(), // Example completed date
    inProgress: new Date("2023-05-31T14:39:34.527+00:00"),
  },
  {
    handler: "Handler2",
    duration: { days: 0, hours: 4, minutes: 0 },
    completedIn: new Date(), // Example completed date
    inProgress: new Date("2023-05-29T16:05:29.066+00:00"),
  },
  {
    handler: "Handler1",
    duration: { days: 0, hours: 1, minutes: 0 },
    completedIn: new Date(), // Example completed date
    inProgress: null,
  },
  // more tasks...
];

function calculateTaskStats(tasks) {
  const taskStats = {};

  tasks.forEach((task) => {
    const handler = task.handler;

    // Calculate task counts per handler
    if (!taskStats[handler]) {
      taskStats[handler] = {
        handler: handler,
        Assigned: 0,
        promptCompleted: 0,
        promptInPercentage: 0,
      };
    }

    taskStats[handler].Assigned++;

    // Calculate prompt completed counts per handler
    if (task.completedIn) {
      const duration = task.duration;
      const taskDurationInMinutes =
        duration.days * 24 * 60 + duration.hours * 60 + duration.minutes;
      const timeDifferenceInMinutes = Math.round(
        (task.completedIn - task.inProgress) / (1000 * 60)
      );
      const isPromptCompleted =
        timeDifferenceInMinutes <= taskDurationInMinutes;

      if (isPromptCompleted) {
        taskStats[handler].promptCompleted++;
      }
    }
  });

  // Calculate prompt completion percentages per handler
  for (const handler in taskStats) {
    const stats = taskStats[handler];
    const promptCompletionPercentage =
      (stats.promptCompleted / stats.Assigned) * 100 || 0;

    stats.promptInPercentage = promptCompletionPercentage.toFixed(2);
  }

  return taskStats;
}

const handlerTaskStats = calculateTaskStats(tasks);
console.log(handlerTaskStats);
