import prisma from '../src/prisma/prisma-client';
import { ResponseFunction } from '../src/types/message.types';

/**
 * CRUD operation to get all dataTypes
 * @returns string containing all the dataTypes
 */
export const getAllDataTypes: ResponseFunction = async () => {
  const data = await prisma.dataType.findMany();
  return JSON.stringify(data);
};
