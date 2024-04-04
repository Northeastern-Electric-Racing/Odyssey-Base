import { DataType } from '../../../utils/data.utils';
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

// Function to simulate adding points along a route from New York City to Los Angeles
async function simulateRoute(createdRunId: number) {
  // Define coordinates for New York City and Los Angeles
  const nycCoordinates = { lat: 40.7128, lng: -74.006 };
  const laCoordinates = { lat: 34.0522, lng: -118.2437 };

  // Calculate intermediate coordinates along the route (you can adjust steps based on your requirement)
  const numberOfSteps = 10; // Number of intermediate points
  const stepLat = (laCoordinates.lat - nycCoordinates.lat) / numberOfSteps;
  const stepLng = (laCoordinates.lng - nycCoordinates.lng) / numberOfSteps;

  // Simulate adding points along the route
  for (let i = 0; i <= numberOfSteps; i++) {
    let intermediateLat = nycCoordinates.lat + stepLat * i;
    const intermediateLng = nycCoordinates.lng + stepLng * i;

    // Ensure latitude stays within the range of -90 to 90
    intermediateLat = Math.min(Math.max(intermediateLat, -90), 90);

    // Construct a ServerData object with the intermediate coordinates
    const serverData = new serverdata.v1.ServerData({
      values: [intermediateLng.toString(), intermediateLat.toString()],
      unit: 'Coord'
    });

    // Add the ServerData object to DataService with the current timestamp
    await DataService.addData(serverData, Date.now(), DataType.Points, createdRunId);

    // Optional: Add a delay to simulate realistic data acquisition
    await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second delay
  }
}

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

  await DataTypeService.upsertDataType(DataType.PackTemp, 'C', 'BMS');
  await DataService.addData(
    new serverdata.v1.ServerData({
      values: ['20'],
      unit: Unit.CELSIUS
    }),
    Date.now(),
    DataType.PackTemp,
    createdRun.id
  );
  await DataService.addData(
    new serverdata.v1.ServerData({
      values: ['21'],
      unit: Unit.CELSIUS
    }),
    Date.now() + 1000,
    DataType.PackTemp,
    createdRun.id
  );
  await DataService.addData(
    new serverdata.v1.ServerData({
      values: ['22'],
      unit: Unit.CELSIUS
    }),
    Date.now() + 2000,
    DataType.PackTemp,
    createdRun.id
  );
  await DataService.addData(
    new serverdata.v1.ServerData({
      values: ['17'],
      unit: Unit.CELSIUS
    }),
    Date.now() + 3000,
    DataType.PackTemp,
    createdRun.id
  );
  await DataService.addData(
    new serverdata.v1.ServerData({
      values: ['25'],
      unit: Unit.CELSIUS
    }),
    Date.now() + 4000,
    DataType.PackTemp,
    createdRun.id
  );
  await DataService.addData(
    new serverdata.v1.ServerData({
      values: ['30'],
      unit: Unit.CELSIUS
    }),
    Date.now() + 5000,
    DataType.PackTemp,
    createdRun.id
  );
  await DataService.addData(
    new serverdata.v1.ServerData({
      values: ['38'],
      unit: Unit.CELSIUS
    }),
    Date.now() + 6000,
    DataType.PackTemp,
    createdRun.id
  );
  await DataService.addData(
    new serverdata.v1.ServerData({
      values: ['32'],
      unit: Unit.CELSIUS
    }),
    Date.now() + 7000,
    DataType.PackTemp,
    createdRun.id
  );
  await DataService.addData(
    new serverdata.v1.ServerData({
      values: ['26'],
      unit: Unit.CELSIUS
    }),
    Date.now() + 8000,
    DataType.PackTemp,
    createdRun.id
  );

  await DataTypeService.upsertDataType('Pack Volt', 'V', 'BMS');
  await DataTypeService.upsertDataType('Pack Current', 'A', 'BMS');
  await DataTypeService.upsertDataType('Pack SOC', '%', 'BMS');

  await DataTypeService.upsertDataType('Accel X', 'Dec', 'MPU');
  await DataTypeService.upsertDataType('Accel Y', 'Dec', 'MPU');
  await DataTypeService.upsertDataType('Accel Z', 'Dec', 'MPU');

  await NodeService.upsertNode('TPU');
  await DataTypeService.upsertDataType('Points', 'Coord', 'TPU');
  // Add Data Points that go around america
  await simulateRoute(createdRun.id);
};

performSeed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
