import prisma from '../prisma/prisma-client';
import { ClientData } from '../types/message.types';
import { NotFoundError } from '../utils/errors.utils';
import { Data } from '@prisma/client';

/**
 * Service class for handling data
 */
export default class DataService {
  /**
   * CRUD operation to get all the data for a given datatype name
   * @param dataTypeName name of the dataType to get data for
   * @returns string contianing list of all data with dataype name
   */
  static getDataByDataTypeName = async (dataTypeName: string) => {
    const dataType = await prisma.dataType.findUnique({
      where: {
        name: dataTypeName
      }
    });

    if (!dataType) {
      throw new NotFoundError('dataType', dataTypeName);
    }

    const queriedData = await prisma.data.findMany({
      where: {
        dataTypeName
      }
    });

    return queriedData.map((data) => {
      return { ...data, time: data.time.toString() };
    });
  };

  /**
   * Adds data to the database
   * @param serverData Container for the data to add, includes name, unit, and value
   * @param unixTime the timestamp of the data
   * @param runId the id of the run associated with the data
   * @returns The created data type
   */
  static addData = async (serverData: ClientData, unixTime: number, dataTypeName: string, runId: number): Promise<Data> => {
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

    return await prisma.data.create({
      data: {
        dataType: { connect: { name: dataType.name } },
        time: unixTime,
        run: { connect: { id: run.id } },
        value: serverData.value as number
      }
    });
  };
}
