import Paho, { Message, ConnectionOptions, Client } from "paho-mqtt";
import { StateUpdater } from "preact/hooks";
import {
  BROKER,
  BROKER_PORT,
  DEBUG,
  GAME_PROPS_TOPIC,
  GAME_STATE_TOPIC,
  KEEP_ALIVE_INTERVAL_SEC,
  PASSWORD,
  USERNAME,
  WEB_SOCKET_ID,
} from "./constants";
import { GameProps, GameState } from "./interfaces";

// Create a MQTT websocket connection
export const client: Client = new Paho.Client(
  BROKER,
  BROKER_PORT,
  WEB_SOCKET_ID
);

const onConnect = (client: Client) => (): void => {
  console.log("Connected!");
  client.subscribe(GAME_STATE_TOPIC);
  client.subscribe(GAME_PROPS_TOPIC);
};

const options: ConnectionOptions = {
  useSSL: false,
  keepAliveInterval: KEEP_ALIVE_INTERVAL_SEC,
  onSuccess: onConnect(client),
  userName: USERNAME,
  password: PASSWORD,
};

client.connect(options);

export const onMessageArrived = (
  setGameState: StateUpdater<GameState>,
  setGameProps: StateUpdater<GameProps>
) => (message: Message): void => {
  if (DEBUG) {
    console.log(`Message Arrived: ${message.destinationName}`);
    console.log(`Message Arrived: ${message.payloadString}`);
  }

  if (message.destinationName == GAME_STATE_TOPIC) {
    setGameState(JSON.parse(message.payloadString) as GameState);
  } else {
    setGameProps(JSON.parse(message.payloadString) as GameProps);
  }
};
