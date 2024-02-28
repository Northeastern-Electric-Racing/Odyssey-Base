import { serverdata } from '../generated/serverdata/v1/serverdata';
import prisma from '../prisma/prisma-client';
import { NotFoundError } from '../utils/errors.utils';
import { data } from '@prisma/client';

/**
 * Service class for handling data
 */
export default class DataService {
  /**
   * CRUD operation to get all the data for a given datatype name
   * @param dataTypeName name of the dataType to get data for
   * @returns string contianing list of all data with dataype name
   */
  static getDataByDataTypeNameAndRunId = async (dataTypeName: string, runId: number) => {
    const dataType = await prisma.dataType.findUnique({
      where: {
        name: dataTypeName
      }
    });

    if (!dataType) {
      throw new NotFoundError('dataType', dataTypeName);
    }

    const run = await prisma.run.findUnique({
      where: {
        id: runId
      }
    });

    if (!run) {
      throw new NotFoundError('run', runId);
    }

    const queriedData = await prisma.data.findMany({
      where: {
        dataTypeName,
        runId
      }
    });

    queriedData.sort((a, b) => a.time.getTime() - b.time.getTime());

    return queriedData.map((data) => {
      return { ...data, time: data.time.getTime(), values: data.values.map((value) => value.toString()) };
    });
  };

  /**
   * Adds data to the database
   * @param serverData Container for the data to add, includes name, unit, and value
   * @param unixTime the timestamp of the data
   * @param dataTypeName the name of the dataType associated with the data
   * @param runId the id of the run associated with the data
   * @returns The created data type
   */
  static addData = async (
    serverData: serverdata.v1.ServerData,
    unixTime: number,
    dataTypeName: string,
    runId: number
  ): Promise<data> => {
    const dataType = await prisma.dataType.findUnique({
      where: {
        name: dataTypeName
      }
    });

    if (!dataType) {
      throw new NotFoundError('dataType', dataTypeName);
    }

    const run = await prisma.run.findUnique({
      where: {
        id: runId
      }
    });

    if (!run) {
      throw new NotFoundError('run', runId);
    }

    const createdData = await prisma.data.create({
      data: {
        dataType: { connect: { name: dataType.name } },
        time: new Date(unixTime),
        run: { connect: { id: run.id } },
        values: serverData.values.map(parseFloat)
      }
    });

    return createdData;
  };
}
