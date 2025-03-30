import { describe, expect, it } from 'vitest';
import { calculateDueDate } from './due-date-calculator';

describe('CalculateDueDate', () => {
  it('shoud calculate due date/time given an issue reported during working hours', () => {
    const reportTime = new Date(2025, 2, 28, 16, 25, 0);

    const computedDueDate = calculateDueDate(reportTime, 16);

    const expectedDueDate = new Date(2025, 3, 1, 16, 25, 0);

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
