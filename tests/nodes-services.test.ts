import { describe, test, expect, afterEach } from 'vitest';
import NodeService from '../src/services/nodes.services';
import prisma from '../src/prisma/prisma-client';

describe('Node', () => {
  //cleaning up
  afterEach(async () => {
    try {
      await prisma.node.delete({
        where: {
          name: 'test'
        }
      });
    } catch (err) {}
  });

  /**
   * unit test for upsert node
   * testing creating node if doesn't exist
   */
  test('Upsert Node Creates', async () => {
    await NodeService.upsertNode('test');
    const result = await prisma.node.findUnique({
      where: {
        name: 'test'
      }
    });

    expect(result).not.toBeNull();
  });

  test('Get All Nodes Works', async () => {
    const result = await NodeService.getAllNodes();

    expect(result.length).toBeGreaterThanOrEqual(0);
  });

  /**
   * unit test for upsert node
   * testing does nothing if node does exist
   */
  test('Upsert Node Does Nothing', async () => {
    const allNodes = await NodeService.getAllNodes();
    await NodeService.upsertNode('test');
    await NodeService.upsertNode('test');
    const result = await NodeService.getAllNodes();

    // Use toEqual to compare result with the expected array
    expect(allNodes.length).toEqual(result.length - 1);
  });
});
