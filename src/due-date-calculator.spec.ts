import { describe, it } from 'vitest';
import { calculateDuteDate } from './due-date-calculator';

describe('CalculateDueDate method', () => {
  it('shoud calculate the due date/time', () => {
    const reportTime = new Date(2025, 2, 25, 14, 12, 0);
    const dueDate = calculateDuteDate(reportTime, 16);
    const expectedTime = new Date(2025, 2, 27, 2, 12, 0);
    expectedTime.setHours(16);

    const intl = Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
    });

    console.log(intl.format(reportTime));
    console.log(intl.format(expectedTime));
    console.log(intl.format(dueDate));
  })
})
