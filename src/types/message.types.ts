import { Topic } from "./topic";
import { Unit } from "./unit";

/**
 * The format of a message sent from the server
 */
export type ServerMessage = {
  unix_time: number;
  node: string;
  data: ServerData[];
};

export type ServerData = {
  name: string;
  value: number;
  units: Unit;
};

/**
 * The format of the message sent to subscribe or unsubscribe from a topic
 */
export type SubscriptionMessage = {
  argument: SubscriptionArgument;
  topics: Topic[];
};

type SubscriptionArgument = 'subscribe' | 'unsubscribe';

