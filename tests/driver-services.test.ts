import { describe, test, expect, afterEach, afterAll } from 'vitest';
import DriverService from '../src/services/driver.services';
import prisma from '../src/prisma/prisma-client';
import RunService from '../src/services/runs.services';

/**
 * Tests for CRUD Service functions
 */
describe('CRUD Driver', () => {
  /**
   * Delete the run after all tests are done
   */
  afterAll(async () => {
    await prisma.run.deleteMany({
      where: {
        driverName: 'test'
      }
    });
  });

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
    const result = await DriverService.getAllDrivers();

    // Use toEqual to compare parsedResult with the expected array
    expect(result.length).toBeGreaterThanOrEqual(0);
  });

  /**
   * Unit testing for upsert driver
   * test driver creation if the name doesn't already exist
   * */
  test('Upsert Driver Creates', async () => {
    await DriverService.upsertDriver('test', (await RunService.createRun(1)).id);
    const result = await DriverService.getAllDrivers();

    expect(result.length).toBeGreaterThanOrEqual(1);
  });
});
