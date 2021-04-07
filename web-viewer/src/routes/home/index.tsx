import { FunctionalComponent, h } from "preact";
import { StateUpdater, useEffect, useRef, useState } from "preact/hooks";
import Paho, { Message, ConnectionOptions, Client } from "paho-mqtt";
import style from "./style.css";

// useful commands:
// mosquitto_pub -t cs326/jcalvin -m "Hello World" -h mqtt.eclipseprojects.io
// mosquitto_sub -h mqtt.eclipseprojects.io -t cs326/jcalvin
// mosquitto_sub -h iot.cs.calvin.edu -t pup/ctrl1 -u cs326 -P piot
// https://medium.com/@pdx.lucasm/canvas-with-react-js-32e133c05258

const BROKER = "mqtt.eclipseprojects.io/mqtt";
const BROKER_PORT = 80;
const USERNAME = "cs326";
const PASSWORD = "piot";

const PADDLE_WIDTH = 50;
const MAX_WIDTH = 1023;
const PADDLE_HALF = PADDLE_WIDTH / 2; // TODO: should this be int division?
const X_CONSTRAINTS = [0, MAX_WIDTH + PADDLE_HALF];
const Y_CONSTRAINTS = [0, MAX_WIDTH + PADDLE_HALF];
const MAX = X_CONSTRAINTS[1];
const SCALE = 2;
const SCALED_MAX = MAX / SCALE;

interface GameState {
  paddle1: number;
  paddle2: number;
  ball: [number, number];
  player1_score: number;
  player2_score: number;
}

const defaultGameState: GameState = {
  paddle1: 50,
  paddle2: 60,
  ball: [50, 50],
  player1_score: -1,
  player2_score: -2,
};

const Home: FunctionalComponent = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>(defaultGameState);

  // TODO: need to move this connection! Made every time.
  const client: Client = new Paho.Client(BROKER, BROKER_PORT, "clientjs");
  const options: ConnectionOptions = {
    useSSL: false,
    keepAliveInterval: 60,
    onSuccess: onConnect(client),
    // userName: USERNAME,
    // password: PASSWORD,
  };
  client.connect(options);
  client.onMessageArrived = onMessageArrived(setGameState);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (context) {
      draw(context, gameState);
    }
  }, [gameState]);

  return (
    <div class={style.home}>
      <h1>Power Up Pong!</h1>
      <canvas
        ref={canvasRef}
        height={SCALED_MAX}
        width={SCALED_MAX}
        style={{ border: "1px solid green" }}
      />
    </div>
  );
};

export default Home;

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

const clearCanvas = (ctx: CanvasRenderingContext2D) => {
  ctx.fillStyle = "rgb(255, 255, 255)";
  ctx.fillRect(0, 0, SCALED_MAX, SCALED_MAX);
};

const onConnect = (client: Client) => () => {
  console.log("Connected!");
  client.subscribe("pup/game");
};

const onMessageArrived = (setGameState: StateUpdater<GameState>) => (
  message: Message
): void => {
  console.log(`Message Arrived: ${message.payloadString}`);
  setGameState(JSON.parse(message.payloadString) as GameState);
};
