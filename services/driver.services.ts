import prisma from "../src/prisma/prisma-client";
import { ResponseFunction } from "../src/types/message.types";

/**
 * CRUD operation to get all dataTypes
 * @returns string containing all the dataTypes
 */
export const getAllDrivers: ResponseFunction = async () => {
  const data = await prisma.driver.findMany();
  return JSON.stringify(data);
};

/**
 * CRUD operation to create a driver in the database if it doesn't already exist, does nothing otherwise.
 */
export const upsertDriver = async (driverName: string) => {
  await prisma.driver.upsert({
    where: {
      username: driverName
    },
    update: {},
    create: {
      username: driverName
    }
  });
};
