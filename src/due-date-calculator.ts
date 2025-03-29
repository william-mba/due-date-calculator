

export function calculateDuteDate(reportedDate: Date, turnAroundTime: number): Date {
  assertWorkingDay(reportedDate);
  let workDay = new WorkDay();
  let dueDate: Date;
  let counter = 1;
  while (turnAroundTime > 0) {
    dueDate = workDay.workingHours[counter];
    turnAroundTime--;
    counter++;
    workDay = workDay.next;
  }
  dueDate = workDay.workingHours[counter]

  return dueDate;
}

interface IWorkDay {
  start: number,
  end: number,
  date: Date,
  prev?: IWorkDay,
  next?: IWorkDay
}

class WorkWeek {
  days: WorkDay[] = []
  readonly prev?: Date;
  readonly workingDays = 5;

  constructor() {
    let workDay = new WorkDay();
    assertWorkingDay(workDay.date);
    for (let i = 1; i <= this.workingDays; i++) {
      this.days.push(workDay);
      workDay = workDay.next;
    }
  }
}

function assertWorkingDay(date: Date) {
  if ((isSaturday(date) || isSunday(date)) || (date.getHours() < 9 && date.getHours() >= 17)) {
    throw new Error("A problem can only be reported during working hours. (e.g. All submit date values are set. Between 9AM to 5PM");
  }
}

class WorkDay implements IWorkDay {
  workingHours: Date[] = []
  readonly start = 9;
  readonly end = 17;
  readonly date: Date;
  readonly prev?: WorkDay;
  readonly next: WorkDay;

  constructor(prev?: WorkDay) {
    const date = new Date();
    if (prev) {
      this.prev = prev;
      date.setTime(prev.date.getTime());
      if (isFridday(prev.date)) {
        date.setDate(date.getDate() + 3) // Go to monday directly
      }
      if (isSaturday(prev.date)) {
        date.setDate(date.getDate() + 2) // Go to monday directly
      }
      if (isSunday(prev.date)) {
        date.setDate(date.getDate() + 1) // Go to monday directly
      }
    }
    date.setHours(this.start);
    for (let i = this.start; i <= this.end; i++) {
      date.setHours(date.getHours() + 1);
      this.workingHours.push(date);
    }
    this.date = date;
    this.next = new WorkDay(this);
  }
}

const isFridday = (date: Date) => date.getDay() === 5;
const isSaturday = (date: Date) => date.getDay() === 6;
const isSunday = (date: Date) => date.getDay() === 6;
