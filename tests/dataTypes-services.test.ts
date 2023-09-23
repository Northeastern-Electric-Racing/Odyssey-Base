import { describe, test, expect } from 'vitest';
import { getAllDataTypes } from '../services/dataTypes.services';
import { DataType } from '@prisma/client';

describe('Data Type', () => {
  test('Get All Data Types Works', async () => {
    const expected: DataType[] = [];
    const result = await getAllDataTypes();

    // Parse result to a JavaScript object from the JSON string
    const parsedResult = JSON.parse(result) as DataType[];

    // Use toEqual to compare parsedResult with the expected array
    expect(parsedResult).toEqual(expected);
  });
});
