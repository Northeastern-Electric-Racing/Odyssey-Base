import { Topic } from "./topic";
import { Unit } from "./unit";

/**
 * The format of the data sent from the server
 */
export type ServerData = {
  value: number | string;
  unit: Unit;
};

export type ServerMessage = {
  node: string;
  dataType: string;
  unix_time: number;
  data: ServerData;
}

/**
 * The format of the message sent to subscribe or unsubscribe from a topic
 */
export type SubscriptionMessage = {
  argument: SubscriptionArgument;
  topics: Topic[];
};

type SubscriptionArgument = 'subscribe' | 'unsubscribe';

