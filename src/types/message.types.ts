import { Topic } from './topic';

/**
 * The format of the data sent from the server
 */
export type ClientData = {
  value: string[] | number[];
  unit: string;
};

export type ServerMessage = {
  node: string;
  dataType: string;
  unix_time: number;
  data: ClientData;
};

/**
 * The format of the message sent to subscribe or unsubscribe from a topic
 */
export type SubscriptionMessage = {
  argument: SubscriptionArgument;
  topics: Topic[];
};

type SubscriptionArgument = 'subscribe' | 'unsubscribe';
