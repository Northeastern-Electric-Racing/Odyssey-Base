import { serverdata } from '../generated/serverdata/v1/serverdata';
import DataService from '../services/data.services';
import DataTypeService from '../services/dataTypes.services';
import DriverService from '../services/driver.services';
import LocationService from '../services/locations.services';
import NodeService from '../services/nodes.services';
import RunService from '../services/runs.services';
import SystemService from '../services/systems.services';
import { Unit } from '../types/unit';
import prisma from './prisma-client';

const performSeed = async () => {
  await prisma.data.deleteMany({});
  await prisma.driver.deleteMany({});
  await prisma.location.deleteMany({});
  await prisma.system.deleteMany({});
  await prisma.dataType.deleteMany({});
  await prisma.node.deleteMany({});
  await prisma.run.deleteMany({});

  const createdRun = await RunService.createRun(Date.now(), 1);

  await SystemService.upsertSystem('Data And Controls', createdRun.id);

  await DriverService.upsertDriver('Fergus', createdRun.id);

  await LocationService.upsertLocation('Gainsborough', 1, 1, 1, createdRun.id);

  await NodeService.upsertNode('BMS');
  await NodeService.upsertNode('MPU');

  await DataTypeService.upsertDataType('Pack Temp', 'C', 'BMS');
  await DataService.addData(
    new serverdata.v1.ServerData({
      values: ['20'],
      unit: Unit.CELSIUS
    }),
    Date.now(),
    'Pack Temp',
    createdRun.id
  );
  await DataService.addData(
    new serverdata.v1.ServerData({
      values: ['21'],
      unit: Unit.CELSIUS
    }),
    Date.now() + 1000,
    'Pack Temp',
    createdRun.id
  );
  await DataService.addData(
    new serverdata.v1.ServerData({
      values: ['22'],
      unit: Unit.CELSIUS
    }),
    Date.now() + 2000,
    'Pack Temp',
    createdRun.id
  );
  await DataService.addData(
    new serverdata.v1.ServerData({
      values: ['17'],
      unit: Unit.CELSIUS
    }),
    Date.now() + 3000,
    'Pack Temp',
    createdRun.id
  );
  await DataService.addData(
    new serverdata.v1.ServerData({
      values: ['25'],
      unit: Unit.CELSIUS
    }),
    Date.now() + 4000,
    'Pack Temp',
    createdRun.id
  );
  await DataService.addData(
    new serverdata.v1.ServerData({
      values: ['30'],
      unit: Unit.CELSIUS
    }),
    Date.now() + 5000,
    'Pack Temp',
    createdRun.id
  );
  await DataService.addData(
    new serverdata.v1.ServerData({
      values: ['38'],
      unit: Unit.CELSIUS
    }),
    Date.now() + 6000,
    'Pack Temp',
    createdRun.id
  );
  await DataService.addData(
    new serverdata.v1.ServerData({
      values: ['32'],
      unit: Unit.CELSIUS
    }),
    Date.now() + 7000,
    'Pack Temp',
    createdRun.id
  );
  await DataService.addData(
    new serverdata.v1.ServerData({
      values: ['26'],
      unit: Unit.CELSIUS
    }),
    Date.now() + 8000,
    'Pack Temp',
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
