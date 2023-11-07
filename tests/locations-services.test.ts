import { describe, test, expect, afterEach, afterAll } from 'vitest';
import LocationService from '../src/services/locations.services';
import prisma from '../src/prisma/prisma-client';
import RunService from '../src/services/runs.services';

/**
 * Service class to handle location crud operations
 */
describe('CRUD Location', () => {
  /**
   * Delete the run after all tests are done
   */
  afterAll(async () => {
    await prisma.run.deleteMany({
      where: {
        time: 1
      }
    });
  });

  /**
   * Clean up after each test
   */
  afterEach(async () => {
    try {
      await prisma.location.delete({
        where: {
          name: 'test'
        }
      });
    } catch (error) {}
  });

  /**
   * Tests Upserts Location works correctly
   */
  test('Get All Locations and Upsert', async () => {
    await LocationService.upsertLocation('test', 100, 200, 300, (await RunService.createRun(1)).id);

    const result = await prisma.location.findUnique({
      where: {
        name: 'test'
      }
    });

    expect(result).not.toBeNull();
  });
});
