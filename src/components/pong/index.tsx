import { FunctionalComponent, h } from "preact";
import {
  StateUpdater,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "preact/hooks";
import Paho, { Message, ConnectionOptions, Client } from "paho-mqtt";
import style from "./style.css";
import {
  BROKER,
  BROKER_PORT,
  DEBUG,
  GAME_PROPS_TOPIC,
  GAME_STATE_TOPIC,
  SCALE,
  SCALED_MAX,
} from "./constants";
import {
  defaultGameProps,
  defaultGameState,
  GameProps,
  GameState,
} from "./interfaces";

// useful commands:
// mosquitto_pub -t cs326/jcalvin -m "Hello World" -h mqtt.eclipseprojects.io
// mosquitto_sub -h mqtt.eclipseprojects.io -t cs326/jcalvin
// mosquitto_sub -h iot.cs.calvin.edu -t pup/ctrl1 -u cs326 -P piot
// https://medium.com/@pdx.lucasm/canvas-with-react-js-32e133c05258

const Pong: FunctionalComponent = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>(defaultGameState);
  const [gameProps, setGameProps] = useState<GameProps>(defaultGameProps);

  client.onMessageArrived = useMemo(() => {
    return onMessageArrived(setGameState, setGameProps);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (context) {
      draw(context, gameState);
    }
  }, [gameState]);

  return (
    <div class={style.pong}>
      <div class={style.center}>
        <p>Game Properties: {JSON.stringify(gameProps)}</p>
        <canvas
          ref={canvasRef}
          height={SCALED_MAX}
          width={SCALED_MAX}
          style={{ border: "1px solid purple" }}
        />
      </div>
    </div>
  );
};

export default Pong;

const draw = (ctx: CanvasRenderingContext2D, gameState: GameState): void => {
  clearCanvas(ctx);

  ctx.fillStyle = "#000000";
  ctx.fillRect(10, 10, 50, 50);

  // draw ball
  ctx.fillStyle = "#000000";
  ctx.beginPath();
  ctx.arc(
    gameState.ball[0] / SCALE,
    gameState.ball[1] / SCALE,
    20,
    0,
    2 * Math.PI
  );
  ctx.fill();
};

// ref: https://stackoverflow.com/a/54153800/9931154
const clearCanvas = (ctx: CanvasRenderingContext2D): void => {
  ctx.fillStyle = "rgb(255, 255, 255)";
  ctx.fillRect(0, 0, SCALED_MAX, SCALED_MAX);
};

const client: Client = new Paho.Client(BROKER, BROKER_PORT, "clientjs");

const onConnect = (client: Client) => (): void => {
  console.log("Connected!");
  client.subscribe(GAME_STATE_TOPIC);
  client.subscribe(GAME_PROPS_TOPIC);
};

const options: ConnectionOptions = {
  useSSL: false,
  keepAliveInterval: 60,
  onSuccess: onConnect(client),
  // userName: USERNAME,
  // password: PASSWORD,
};
client.connect(options);

const onMessageArrived = (
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
