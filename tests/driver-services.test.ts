import { describe, test, expect, afterEach } from 'vitest';
import prisma from '../src/prisma/prisma-client';
import { getAllDrivers, upsertDriver } from '../services/driver.services';
import { Driver } from '@prisma/client';

/**
 * Tests for CRUD Service functions
 */
describe('CRUD Driver', () => {
  //Deleting test driver after each test
  afterEach(async () => {
    try {
      await prisma.driver.delete({
        where: {
          username: 'test'
        }
      });
    } catch (err) {}
  });

  /**
   * unit test for get all drivers
   */
  test('Get All Drivers Works', async () => {
    const expected: Driver[] = [];
    const result = await getAllDrivers();

    // Parse result to a JavaScript object from the JSON string
    const parsedResult = JSON.parse(result) as Driver[];

    // Use toEqual to compare parsedResult with the expected array
    expect(parsedResult).toEqual(expected);
  });

  /**
   * Unit testing for upsert driver
   * test driver creation if the name doesn't already exist
   * */
  test('Upsert Driver Creates', async () => {
    const expected: Driver[] = [{ username: 'test' }];
    await upsertDriver('test');
    const result = JSON.parse(await getAllDrivers()) as Driver[];

    expect(result).toEqual(expected);
  });
});
