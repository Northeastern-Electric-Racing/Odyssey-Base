import { JsonObject } from '@prisma/client/runtime/library';

/**
 * Custom Error message based on given invalid data and name of expected data type
 * @param data invalid JsonObject
 * @param typeName name of expected DataType as string
 */
export const InvalidDataError = (data: JsonObject, typeName: string) => {
  throw new Error(`Invalid data provided, Expected data of type ${typeName} and got ${JSON.stringify(data)}`);
};

/**
 * Types of data that can be not found
 */
type MissingType = 'location' | 'run' | 'dataType' | 'data';

/**
 * Custom Error message based on given missing data and type of data
 */
export class NotFoundError extends Error {
  public status: number;

  constructor(type: MissingType, id?: string | number) {
    super(`${type} with id ${id} not found`);
    this.status = 404;
  }
}
