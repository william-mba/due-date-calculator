import { describe, expect, it } from 'vitest';
import { calculateDueDate, ERROR_MESSAGES } from './due-date-calculator';

describe('Due Date Calculator', () => {
  it('shoud calculate due date for issues reported during working hours', () => {
    const reportDate = new Date(2025, 2, 31, 14, 12, 0);
    const expectedDueDate = new Date(2025, 3, 1, 14, 12, 0);
    const computedDueDate = calculateDueDate({ reportDate, turnAroundTime: 8 });

    expect(expectedDueDate.getTime()).toBe(computedDueDate.getTime());
  })

  it('should calculate due date for turnaround times that extend to a week', () => {
    const reportDate = new Date(2025, 3, 1, 16, 59); // Tuesday, 1st April 2025 at 4:59 AM
    const expectedDueDate = new Date(2025, 3, 8, 16, 59); // Tuesday, 8 April 2025 at 4:59 AM
    const computedDueDate = calculateDueDate({ reportDate, turnAroundTime: 40 /* equals 1 week.*/ });

    expect(expectedDueDate.getTime()).toBe(computedDueDate.getTime());
  })

  it('should handle turnaround times that extend more than one working day', () => {
    const reportDate = new Date(2025, 3, 8, 14, 12); // Tuesday, 8 April 2025 at 2:12 AM
    const expectedDueDate = new Date(2025, 3, 10, 14, 12); // Thursday, 10 April 2025 at 2:12 AM
    const computedDueDate = calculateDueDate({ reportDate, turnAroundTime: 16 /* equals 2 workind days.*/ });

    expect(expectedDueDate.getTime()).toBe(computedDueDate.getTime());
  })

  it('should calculate due date for issues reported close to the closing hour of working day', () => {
    const reportDate = new Date(2025, 2, 27, 16, 59, 0); // Thursday, 27 March 2025 at 4:59 PM
    const expectedDueDate = new Date(2025, 2, 28, 9, 59, 0); // Friday, 28 March 2025 at 9:59 AM
    const computedDueDate = calculateDueDate({ reportDate, turnAroundTime: 1 });

    expect(expectedDueDate.getTime()).toBe(computedDueDate.getTime());
  })

  it('should calculate due date for issues reported on friday with turnaround time that extend the closing hour', () => {
    const reportDate = new Date(2025, 2, 28, 15, 0, 0); // Friday, 28 March 2025 at 3 PM
    const expectedDueDate = new Date(2025, 2, 31, 12, 0, 0); // Monday, 31 March 2025 at 12 PM
    const computedDueDate = calculateDueDate({ reportDate, turnAroundTime: 5 });

    expect(expectedDueDate.getTime()).toBe(computedDueDate.getTime());
  })

  it('should throw an error for invalid report date', () => {
    const reportDate = new Date(2025, 2, 30, 16, 25, 0); // Sunday, 30 March 2025 at 4:25 PM
    const errorMessage = ERROR_MESSAGES.invalidWorkingHours;
    expect(() => calculateDueDate({ reportDate, turnAroundTime: 16 })).toThrowError(errorMessage);
  })

  it('shoud throw an error for invalid turnaround time', () => {
    const reportDate = new Date(2025, 2, 31, 16, 25, 0); // Monday, 31 March 2025 at 4:25 PM
    const errorMessage = ERROR_MESSAGES.invalidTurnAroundTime;
    expect(() => calculateDueDate({ reportDate, turnAroundTime: -16 })).toThrowError(errorMessage);
    expect(() => calculateDueDate({ reportDate, turnAroundTime: Infinity })).toThrowError(errorMessage);
    expect(() => calculateDueDate({ reportDate, turnAroundTime: 0 })).toThrowError(errorMessage);
    expect(() => calculateDueDate({ reportDate, turnAroundTime: 1 })).not.toThrowError(errorMessage);
  })
})
