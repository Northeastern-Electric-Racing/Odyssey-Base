import { dataType } from '@prisma/client';
import prisma from '../prisma/prisma-client';
import { ResponseFunction } from '../utils/response-function';

/**
 * Service for dataTypes
 */
export default class DataTypeService {
  /**
   * CRUD operation to get all dataTypes
   * @returns string containing all the dataTypes
   */
  static getAllDataTypes: ResponseFunction<dataType[]> = async () => {
    const data = await prisma.dataType.findMany();
    return data;
  };

  /**
   * CRUD operation to upsert the data types if it does not exist, updates if it does
   * @param dataTypeName name of the dataType
   */
  static upsertDataType = async (dataTypeName: string, unit: string, nodeName: string): Promise<dataType> => {
    if (
      !(await prisma.node.findUnique({
        where: { name: nodeName }
      }))
    ) {
      throw new Error(`Node with the name "${nodeName}" does not exist`);
    }

    const dataType = await prisma.dataType.findUnique({
      where: { name: dataTypeName }
    });

    if (dataType) {
      return dataType;
    }

    const createdDataType = await prisma.dataType.create({
      data: {
        name: dataTypeName,
        unit,
        node: { connect: { name: nodeName } }
      }
    });

    return createdDataType;
  };
}
