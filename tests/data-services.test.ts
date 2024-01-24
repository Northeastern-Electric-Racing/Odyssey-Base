import { describe, test, expect, afterEach, afterAll } from 'vitest';
import DataService from '../src/services/data.services';
import prisma from '../src/prisma/prisma-client';
import DataTypeService from '../src/services/dataTypes.services';
import NodeService from '../src/services/nodes.services';
import RunService from '../src/services/runs.services';
import { Data } from '@prisma/client';
import { Unit } from '../src/types/unit';

/**
 * Unit Tests for Data
 */
describe('Data', () => {
  afterEach(async () => {
    try {
      await prisma.data.deleteMany({
        where: {
          dataTypeName: 'test'
        }
      });
    } catch (error) {}
    try {
      await prisma.dataType.delete({
        where: {
          name: 'test'
        }
      });
    } catch (error) {}
    try {
      await prisma.node.delete({
        where: {
          name: 'test'
        }
      });
    } catch (error) {}
  });

  afterAll(async () => {
    try {
      await prisma.run.deleteMany({
        where: {
          time: 1
        }
      });
    } catch (error) {}
  });

  test('Get All Data by DataType Name works w valid data', async () => {
    await NodeService.upsertNode('test');
    await DataTypeService.upsertDataType('test', 'joe mama', 'test');
    const result = await DataService.getDataByDataTypeName('test');

    // Use toEqual to compare parsedResult with the expected array
    expect(result).toEqual(result);
  });

  test('Get All Data by DataType Name throws w invalid data', async () => {
    //throws w no data
    await expect(() => DataService.getDataByDataTypeName('test')).rejects.toThrowError('dataType with id test not found');
  });

  test('Add Data Succeeds', async () => {
    const serverData = {
      value: 0,
      unit: Unit.AMPERAGE
    };

    await NodeService.upsertNode('test');
    await DataTypeService.upsertDataType('test', 'joe mama', 'test');
    const run = await RunService.createRun(1);

    const result = await DataService.addData(serverData, 1, 'test', run.id);
    const expected: Data = {
      id: result.id,
      dataTypeName: 'test',
      value: 0,
      time: BigInt(1),
      runId: run.id
    };

    expect(result).toEqual(expected);
  });

  test('addData throws error when no dataTypeName', async () => {
    const serverData = {
      value: 0,
      unit: Unit.AMPERAGE
    };
    //throws w no data
    await expect(() => DataService.addData(serverData, 1, 'test', 1)).rejects.toThrowError(
      'dataType with id test not found'
    );
  });
});
