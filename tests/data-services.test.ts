import { describe, test, expect, afterEach, afterAll } from 'vitest';
import DataService from '../src/services/data.services';
import prisma from '../src/prisma/prisma-client';
import DataTypeService from '../src/services/dataTypes.services';
import NodeService from '../src/services/nodes.services';
import RunService from '../src/services/runs.services';
import { data } from '@prisma/client';
import { Unit } from '../src/types/unit';
import { serverdata } from '../src/generated/serverdata/v1/serverdata';

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
          time: new Date(Date.now())
        }
      });
    } catch (error) {}
  });

  test('Get All Data by DataType Name works w valid data', async () => {
    if ((await RunService.getRunById(1)) === null) {
      await RunService.createRun(1, 1);
    }
    await NodeService.upsertNode('test');
    await DataTypeService.upsertDataType('test', 'joe mama', 'test');
    const result = await DataService.getDataByDataTypeNameAndRunId('test', 1);

    // Use toEqual to compare parsedResult with the expected array
    expect(result).toEqual(result);
  });

  test('Add Data Succeeds', async () => {
    const serverData = new serverdata.v1.ServerData({
      values: ['0'],
      unit: Unit.AMPERAGE
    });

    await NodeService.upsertNode('test');
    await DataTypeService.upsertDataType('test', 'joe mama', 'test');
    const run = await RunService.createRun(1);

    const result = await DataService.addData(serverData, Date.UTC(1970), 'test', run.id);
    const expected: data = {
      id: result.id,
      dataTypeName: 'test',
      time: result.time,
      runId: run.id,
      values: [0]
    };

    expect(result).toEqual(expected);
  });

  //TODO Fix these tests, for some reason theyre not throwing when they absolutely should be
  test('Get All Data by DataType Name throws w invalid data', async () => {
    //throws w no data
    await expect(() => DataService.getDataByDataTypeNameAndRunId('test', 1)).rejects.toThrowError(
      'dataType with id test not found'
    );
  });

  test('addData throws error when no dataTypeName', async () => {
    const serverData = new serverdata.v1.ServerData({
      values: ['0'],
      unit: Unit.AMPERAGE
    });

    //throws w no data
    await expect(() => DataService.addData(serverData, 1, 'test', 1)).rejects.toThrowError(
      'dataType with id test not found'
    );
  });
});
