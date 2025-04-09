interface IssueReport {
  /**
   * The datetime of the reported issue. Default it's the current Datetime.
   */
  reportDate: Date,
  /**
   * The turnaround time. Default it's a working day.
   */
  turnAroundTime: number
}

/** Returns the calculated due date/time of the given issue report. */
export function calculateDueDate(
  issueReport: IssueReport = { reportDate: new Date(), turnAroundTime: WORKING_DAY.getTotalHours() }
): Date {
  assertIssueReport(issueReport);

  let { turnAroundTime } = issueReport;
  const dueDate = new Date(issueReport.reportDate);

  while (turnAroundTime > 0) {
    const dueTime = Math.min(turnAroundTime, WORKING_DAY.getRemainingHours(dueDate));
    dueDate.setHours(dueDate.getHours() + dueTime);
    if (WORKING_DAY.isClosing(dueDate)) {
      const newDueTime = WORKING_DAY.next(dueDate).setHours(WORKING_DAY.opening);
      dueDate.setTime(newDueTime);
    }
    turnAroundTime -= dueTime;
  }
  return dueDate;
}

export const ERROR_MESSAGES = {
  invalidWorkingHours: "Invalid working hours. A problem can only be reported during working hours.",
  invalidTurnAroundTime: "Invalid turnaround time. Turnaround time must be an interger and setted in hour."
}

function assertIssueReport(report: unknown): asserts report is IssueReport {
  assertWorkingDay((report as IssueReport).reportDate);
  assertTurnAroundTime((report as IssueReport).turnAroundTime);
}

function assertWorkingDay(date: unknown): asserts date is Date {
  if (!WORKING_DAY.isWorkingDay((date as Date)) || !WORKING_DAY.isWorkingHours((date as Date))) {
    throw new Error(ERROR_MESSAGES.invalidWorkingHours);
  }
}

function assertTurnAroundTime(value: unknown): asserts value is number {
  if (!Number.isInteger(value) || (Number.isInteger(value) && (value as number) <= 0)) {
    throw new Error(ERROR_MESSAGES.invalidTurnAroundTime);
  }
}

/** Week day indice.
 * - 0 => Sunday
 * - 1 => Monday
 * - 2 => Tuesday
 * - 3 => Wednesday
 * - 4 => Thursday
 * - 5 => Friday
 * - 6 => Saturday
 */
type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6

interface WorkingDay {
  opening: number;
  closing: number;
  /** Returns the next working day. */
  next: (current: Date) => Date;
  isClosing: (current: Date) => boolean;
  isWorkingDay: (date: Date) => boolean;
  isWorkingHours: (date: Date) => boolean;
  /** Returns the total working hours of the day. */
  getTotalHours: () => number;
  /** Returns the remining working hours of the day. */
  getRemainingHours: (current: Date) => number;
}

function createWorkingDay(
  workingDay: Pick<WorkingDay, 'opening' | 'closing'> = { opening: 9, closing: 17 },
  holiday: WeekDay[] = [0, 6]
): WorkingDay {
  function getTotalHours(): number {
    return workingDay.closing - workingDay.opening
  }
  function getRemainingHours(current: Date): number {
    const currentHours = current.getHours()
    return workingDay.closing - currentHours
  }
  function isWorkingDay(date: Date): boolean {
    const day = date.getDay() as WeekDay;
    return !holiday.includes(day)
  }
  function isWorkingHours(date: Date): boolean {
    const hours = date.getHours();
    return workingDay.opening <= hours && hours < workingDay.closing;
  };
  function next(current: Date): Date {
    const date = new Date(current);
    do {
      const newDate = date.getDate() + 1
      date.setDate(newDate);
    } while (!isWorkingDay(date));
    return date
  }
  function isClosing(current: Date): boolean {
    return current.getHours() === workingDay.closing;
  }

  return {
    opening: workingDay.opening,
    closing: workingDay.closing,
    next,
    isClosing,
    isWorkingDay,
    isWorkingHours,
    getTotalHours,
    getRemainingHours
  }
}

const WORKING_DAY = createWorkingDay();
