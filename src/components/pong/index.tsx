import { FunctionalComponent, h } from "preact";
import {
  StateUpdater,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "preact/hooks";
import Paho, { Message, ConnectionOptions, Client } from "paho-mqtt";
import {
  BROKER,
  BROKER_PORT,
  DEBUG,
  GAME_PROPS_TOPIC,
  GAME_STATE_TOPIC,
} from "./constants";
import {
  defaultGameProps,
  defaultGameState,
  DerivedConstants,
  GameProps,
  GameState,
} from "./interfaces";
import style from "./style.css";
import { getDerivedConstants } from "./getDerivedConstants";

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

  const derivedConstants = useMemo(() => {
    return getDerivedConstants(gameProps);
  }, [gameProps]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (context) {
      draw(context, gameState, gameProps, derivedConstants);
    }
  }, [gameState, gameProps, derivedConstants]);

  const { CANVAS_HEIGHT, CANVAS_WIDTH } = derivedConstants;
  const { player1_score, player2_score } = gameState;

  return (
    <div class={style.pong}>
      <div class={style.center}>
        <p>Game Properties: {JSON.stringify(gameProps)}</p>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <h2>Player 1 Score: {player1_score}</h2>
          <h2>Player 2 Score: {player2_score}</h2>
        </div>
        <canvas
          ref={canvasRef}
          height={CANVAS_HEIGHT}
          width={CANVAS_WIDTH}
          style={{ border: "1px solid purple" }}
        />
      </div>
    </div>
  );
};

export default Pong;

// ref: https://stackoverflow.com/a/54153800/9931154
const clearCanvas = (
  ctx: CanvasRenderingContext2D,
  { CANVAS_HEIGHT, CANVAS_WIDTH }: DerivedConstants
): void => {
  ctx.fillStyle = "rgb(255, 255, 255)";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
};

const draw = (
  ctx: CanvasRenderingContext2D,
  gameState: GameState,
  gameProps: GameProps,
  derivedConstants: DerivedConstants
): void => {
  const { powerup_radius } = gameProps;
  const {
    paddle1,
    paddle2,
    ball: [ballX, ballY],
    powerups,
    paddle1_width,
    paddle2_width,
  } = gameState;
  const {
    SCALE,
    CANVAS_PADDING,
    CANVAS_WIDTH,
    X_CONSTRAINTS,
    Y_CONSTRAINTS,
  } = derivedConstants;
  const HALF_PADDING = CANVAS_PADDING / 2;
  const PADDLE_THICKNESS = 1;
  const BALL_RADIUS = 2;

  clearCanvas(ctx, derivedConstants);

  ctx.fillStyle = "#000000";
  // draw paddle 1
  ctx.fillRect(
    HALF_PADDING,
    paddle1 * SCALE + HALF_PADDING,
    PADDLE_THICKNESS,
    paddle1_width * SCALE
  );

  // draw paddle 2
  ctx.fillRect(
    CANVAS_WIDTH - HALF_PADDING,
    paddle2 * SCALE + HALF_PADDING,
    PADDLE_THICKNESS,
    paddle2_width * SCALE
  );

  // draw powerups
  if (powerups.length > 0) {
    powerups.forEach((powerup) => {
      const { pos, type } = powerup;
      ctx.fillStyle = type === "paddleGrow" ? "green" : "orange";
      if (pos !== null) {
        const [xPos, yPos] = pos;
        ctx.fillRect(
          (xPos + 0) * SCALE,
          (yPos + 0) * SCALE,
          powerup_radius * 2 * SCALE,
          powerup_radius * 2 * SCALE
        );
      }
    });
  }

  // draw ball
  ctx.fillStyle = "#000000";
  const calculatedBallX = (ballX - X_CONSTRAINTS[0]) * SCALE + HALF_PADDING;
  const calculatedBallY = (ballY - Y_CONSTRAINTS[0]) * SCALE + HALF_PADDING;

  if (DEBUG) {
    console.log(HALF_PADDING, SCALE);
    console.log(ballX, ballY);
    console.log(calculatedBallX, calculatedBallY);
  }
  ctx.beginPath();
  ctx.arc(calculatedBallX, calculatedBallY, BALL_RADIUS, 0, 2 * Math.PI);
  ctx.fill();
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
