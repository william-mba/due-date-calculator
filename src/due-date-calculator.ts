const WORKING_DAY = {
  opening: 9,
  closing: 17
}

export function calculateDueDate(reportedDate: Date, turnAroundTime: number): Date {
  assertWorkingDay(reportedDate);

  const dueDate = new Date(reportedDate);

  // A function that increment the due date 
  // ensuring it remain inside working days. 
  const toNextWorkingDay = (date: Date) => {
    if (!isWeekend(date)) {
      date.setDate(date.getDate() + 1);
      return;
    }
    while (isWeekend(date)) {
      date.setDate(date.getDate() + 1);
    }
  }
  while (turnAroundTime > 0) {
    if (isWeekend(dueDate)) {
      toNextWorkingDay(dueDate);
    }
    if (!isWorkingHour(dueDate)) {
      // if due date time it's too early, set it to opening hour
      if (dueDate.getHours() < WORKING_DAY.opening) {
        dueDate.setHours(WORKING_DAY.opening)
      }
      // if due date time it's too late, 
      // set it to opening hour of the next working day
      else if (dueDate.getHours() >= WORKING_DAY.closing) {
        toNextWorkingDay(dueDate);
        dueDate.setHours(WORKING_DAY.opening);
      }
    }
    let remainingWorkingHours = WORKING_DAY.closing - dueDate.getHours();
    // Increment the due date time as long as we have not reach the end of the working day 
    // and the turn around time is still greater than zero.
    while (remainingWorkingHours > 0 && turnAroundTime > 0) {
      dueDate.setHours(dueDate.getHours() + 1);
      remainingWorkingHours--;
      turnAroundTime--;
      // If we reach the closing hour and the due datetime overlaps in minutes,
      // we want to reschedule the due datetime for the next working day.
      if (dueDate.getHours() === WORKING_DAY.closing && dueDate.getMinutes() > 0) {
        toNextWorkingDay(dueDate);
        dueDate.setHours(WORKING_DAY.opening);
        dueDate.setMinutes(dueDate.getMinutes());
      }
    }
  }
  return dueDate;
}

function assertWorkingDay(date: Date) {
  if (isWeekend(date) || !isWorkingHour(date)) {
    throw new Error("A problem can only be reported during working hours. Between 9AM to 5PM.");
  }
}

const isWorkingHour = (date: Date) => (date.getHours() >= WORKING_DAY.opening && date.getHours() < WORKING_DAY.closing);
const isWeekend = (date: Date) => date.getDay() === 6 || date.getDay() === 0;
