/** Returns the calculated due date/time of the given issue report. */
export function calculateDueDate(issueReport: IssueReport = { reportDate: new Date(), turnAroundTime: 3 }): Date {
  assertIssueReport(issueReport);

  let { turnAroundTime, reportDate } = issueReport;
  let dueDate = new Date(reportDate);

  while (turnAroundTime > 0) {
    const remaingWorkingHours = WORKING_DAY.closing - dueDate.getHours();
    const dueTime = Math.min(turnAroundTime, remaingWorkingHours);
    dueDate.setHours(dueDate.getHours() + dueTime);
    if (dueDate.getHours() === WORKING_DAY.closing) {
      dueDate = toNextWorkingDay(dueDate);
      dueDate.setHours(WORKING_DAY.opening)
    }
    turnAroundTime -= dueTime;
  }
  return dueDate;
}

function assertIssueReport(report: IssueReport) {
  assertWorkingDay(report.reportDate);
  assertTurnAroundTime(report.turnAroundTime);
}

function assertWorkingDay(date: Date) {
  if (isWeekend(date) || !isWorkingHour(date)) {
    throw new Error(ERROR_MESSAGES.invalidWorkingHours);
  }
}

function assertTurnAroundTime(value: number) {
  if (isNaN(value) || !Number.isInteger(value) || (value === Infinity || value <= 0)) {
    throw new Error(ERROR_MESSAGES.invalidTurnAroundTime);
  }
}

const WORKING_DAY = {
  opening: 9,
  closing: 17,
  weekend: [0, 6]
} satisfies WorkingDay

interface WorkingDay {
  opening: number,
  closing: number,
  weekend: [number, number]
}

interface IssueReport {
  reportDate: Date,
  turnAroundTime: number
}

export const ERROR_MESSAGES = {
  invalidWorkingHours: "Invalid working hours. A problem can only be reported during working hours.",
  invalidTurnAroundTime: "Invalid turnaround time. Turnaround time must be an interger and setted in hour."
}

/** Increments date ensuring it remain inside working days.*/
const toNextWorkingDay = (currentDate: Date) => {
  const date = new Date(currentDate);
  do {
    date.setDate(date.getDate() + 1);
  } while (isWeekend(date));
  return date
}
const isWorkingHour = (date: Date) => {
  const hours = date.getHours();
  return WORKING_DAY.opening <= hours && hours < WORKING_DAY.closing;
};
const isWeekend = (date: Date) => {
  const day = date.getDay();
  return WORKING_DAY.weekend.includes(day);
};
