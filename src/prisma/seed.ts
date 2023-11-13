import DataTypeService from '../services/dataTypes.services';
import NodeService from '../services/nodes.services';
import prisma from './prisma-client';

const performSeed = async () => {
  await NodeService.upsertNode('BMS');
  await NodeService.upsertNode('MPU');

  await DataTypeService.upsertDataType('Pack Temp', 'C', 'BMS');
  await DataTypeService.upsertDataType('Pack Volt', 'V', 'BMS');
  await DataTypeService.upsertDataType('Pack Current', 'A', 'BMS');
  await DataTypeService.upsertDataType('Pack SOC', '%', 'BMS');

  await DataTypeService.upsertDataType('Accel X', 'Dec', 'MPU');
  await DataTypeService.upsertDataType('Accel Y', 'Dec', 'MPU');
  await DataTypeService.upsertDataType('Accel Z', 'Dec', 'MPU');
};

performSeed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
