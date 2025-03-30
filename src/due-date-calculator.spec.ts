import { describe, expect, it } from 'vitest';
import { calculateDueDate } from './due-date-calculator';

describe('CalculateDueDate', () => {
  it('shoud calculate due date/time given an issue reported during working hours', () => {
    // Case 1
    let reportedDateTime = new Date(2025, 2, 27, 16, 59, 0);
    let turnAroundTime = 1;
    let expectedDueDate = new Date(2025, 2, 28, 9, 59, 0);
    let computedDueDate = calculateDueDate(reportedDateTime, turnAroundTime);

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

    console.group('CASE 1')
    console.log('Turn around.:', turnAroundTime);
    console.log('Report Time.:', intl.format(reportedDateTime));
    console.log('Due Date....:', intl.format(computedDueDate));
    console.groupEnd();

    expect(expectedDueDate.getTime()).toBe(computedDueDate.getTime());

    // Case 2
    reportedDateTime = new Date(2025, 2, 28, 15, 0, 0);
    turnAroundTime = 5;
    expectedDueDate = new Date(2025, 2, 31, 12, 0, 0);
    computedDueDate = calculateDueDate(reportedDateTime, turnAroundTime);

    console.group('CASE 2')
    console.log('Turn around.:', turnAroundTime);
    console.log('Report Time.:', intl.format(reportedDateTime));
    console.log('Due Date....:', intl.format(computedDueDate));
    console.groupEnd();

    expect(expectedDueDate.getTime()).toBe(computedDueDate.getTime());

    // Case 3
    reportedDateTime = new Date(2025, 2, 31, 14, 12, 0);
    turnAroundTime = 8;
    expectedDueDate = new Date(2025, 3, 1, 14, 12, 0);
    computedDueDate = calculateDueDate(reportedDateTime, turnAroundTime);

    console.group('CASE 3')
    console.log('Turn around.:', turnAroundTime);
    console.log('Report Time.:', intl.format(reportedDateTime));
    console.log('Due Date....:', intl.format(computedDueDate));
    console.groupEnd();

    expect(expectedDueDate.getTime()).toBe(computedDueDate.getTime());
  })

  it('should throw an error for issues reported outside working hours', () => {
    const reportTime = new Date(2025, 2, 30, 16, 25, 0);
    let thrownedError: unknown | null = null
    try {
      calculateDueDate(reportTime, 16);
    } catch (error) {
      thrownedError = error
    }
    expect(thrownedError).toBeTruthy();
    expect(thrownedError).not.toBe(null);
  })
})
