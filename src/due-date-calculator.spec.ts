import { describe, expect, it } from 'vitest';
import { calculateDueDate, ERROR_MESSAGES } from './due-date-calculator';

describe('Due Date Calculator', () => {
  it('should calculate due date for issues reported during working hours', () => {
    const reportDate = new Date('2025-03-31 14:12');
    const expectedDueDate = new Date('2025-04-1 14:12');
    const turnAroundTime = 8;

    const computedDueDate = calculateDueDate({ reportDate, turnAroundTime });

    expect(expectedDueDate.getTime()).toBe(computedDueDate.getTime());
  });

  it('should calculate due date for turnaround times that extend to a week', () => {
    const reportDate = new Date('2025-4-1 16:59');
    const expectedDueDate = new Date('2025-4-8 16:59');
    const turnAroundTime = 40; /* equals 1 week.*/

    const computedDueDate = calculateDueDate({ reportDate, turnAroundTime });

    expect(expectedDueDate.getTime()).toBe(computedDueDate.getTime());
  });

  it('should handle turnaround times that extend more than one working day', () => {
    const reportDate = new Date('2025-04-8 14:12');
    const expectedDueDate = new Date('2025-04-10 14:12');
    const turnAroundTime = 16; /* equals 2 workind days.*/

    const computedDueDate = calculateDueDate({ reportDate, turnAroundTime });

    expect(expectedDueDate.getTime()).toBe(computedDueDate.getTime());
  });

  it('should calculate due date for issues reported close to the closing hour of working day', () => {
    const reportDate = new Date('2025-3-27 16:59');
    const expectedDueDate = new Date('2025-3-28 9:59');
    const turnAroundTime = 1;

    const computedDueDate = calculateDueDate({ reportDate, turnAroundTime });

    expect(expectedDueDate.getTime()).toBe(computedDueDate.getTime());
  });

  it('should calculate due date for issues reported on Friday with turnaround time that extend the closing hour', () => {
    const reportDate = new Date('2025-3-28 15:00');
    const expectedDueDate = new Date('2025-3-31 12:00');
    const turnAroundTime = 5;

    const computedDueDate = calculateDueDate({ reportDate, turnAroundTime });

    expect(expectedDueDate.getTime()).toBe(computedDueDate.getTime());
  });

  it('should throw an error for invalid report date', () => {
    const reportDate = new Date('2025-3-30 16:25');
    const errorMessage = ERROR_MESSAGES.invalidWorkingHours;
    const turnAroundTime = 16;

    expect(() => calculateDueDate({ reportDate, turnAroundTime })).toThrowError(
      errorMessage
    );
  });

  describe('turnaround time', () => {
    const reportDate = new Date('2025-3-31 16:25');
    const errorMessage = ERROR_MESSAGES.invalidTurnAroundTime;

    it('should throw an error when a negative value is given', () => {
      expect(() => {
        const turnAroundTime = -16;

        calculateDueDate({ reportDate, turnAroundTime });
      }).toThrowError(errorMessage);
    });

    it('should throw an error when an infinite value is given', () => {
      expect(() => {
        const turnAroundTime = Infinity;

        calculateDueDate({ reportDate, turnAroundTime });
      }).toThrowError(errorMessage);
    });

    it('should throw an error when value equals zero', () => {
      expect(() => {
        const turnAroundTime = 0;

        calculateDueDate({ reportDate, turnAroundTime });
      }).toThrowError(errorMessage);
    });

    it('should not throw an error when a valid value is given', () => {
      expect(() => {
        const turnAroundTime = 1;

        calculateDueDate({ reportDate, turnAroundTime });
      }).not.toThrowError();
    });
  });
});
