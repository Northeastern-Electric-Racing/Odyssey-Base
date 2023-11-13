import DataService from '../services/data.services';
import DataTypeService from '../services/dataTypes.services';
import NodeService from '../services/nodes.services';
import RunService from '../services/runs.services';
import { Unit } from '../types/unit';
import prisma from './prisma-client';

const performSeed = async () => {
  const createdRun = await RunService.createRun(Date.now());

  await NodeService.upsertNode('BMS');
  await NodeService.upsertNode('MPU');

  await DataTypeService.upsertDataType('Pack Temp', 'C', 'BMS');
  await DataService.addData(
    {
      value: 20,
      name: 'Pack Temp',
      units: Unit.CELSIUS
    },
    Date.now(),
    createdRun.id
  );
  await DataService.addData(
    {
      value: 21,
      name: 'Pack Temp',
      units: Unit.CELSIUS
    },
    Date.now() + 1000,
    createdRun.id
  );
  await DataService.addData(
    {
      value: 18,
      name: 'Pack Temp',
      units: Unit.CELSIUS
    },
    Date.now() + 2000,
    createdRun.id
  );
  await DataService.addData(
    {
      value: 17,
      name: 'Pack Temp',
      units: Unit.CELSIUS
    },
    Date.now() + 3000,
    createdRun.id
  );
  await DataService.addData(
    {
      value: 25,
      name: 'Pack Temp',
      units: Unit.CELSIUS
    },
    Date.now() + 4000,
    createdRun.id
  );
  await DataService.addData(
    {
      value: 30,
      name: 'Pack Temp',
      units: Unit.CELSIUS
    },
    Date.now() + 5000,
    createdRun.id
  );
  await DataService.addData(
    {
      value: 38,
      name: 'Pack Temp',
      units: Unit.CELSIUS
    },
    Date.now() + 6000,
    createdRun.id
  );
  await DataService.addData(
    {
      value: 32,
      name: 'Pack Temp',
      units: Unit.CELSIUS
    },
    Date.now() + 7000,
    createdRun.id
  );
  await DataService.addData(
    {
      value: 26,
      name: 'Pack Temp',
      units: Unit.CELSIUS
    },
    Date.now() + 8000,
    createdRun.id
  );

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
