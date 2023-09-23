import { Topic } from './topic';

/**
 * The format of a message sent from the server
 */
export type ServerMessage = {
  unix_time: number;
  node: string;
  data: ServerData[];
};

/**
 * The format of the data sent from the server
 */
type ServerData = {
  name: string;
  value: number;
  units: string;
};

/**
 * The format of the message sent to subscribe or unsubscribe from a topic
 */
export type SubscriptionMessage = {
  argument: SubscriptionArgument;
  topics: Topic[];
};

type SubscriptionArgument = 'subscribe' | 'unsubscribe';

/*
 * The type of a function that responds to a message from the client
 */
export type ResponseFunction = (data?: JSON) => Promise<string>;
