/*
A web viewer for a Power-Up Pong game using websockets
Written by Jon Ellis, Charlie Kornoelje, and Ryan Vreeke
for CS 326 Final Project at Calvin University, April 2021
*/

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
  USERNAME,
  PASSWORD,
} from "./constants";
import {
  defaultGameProps,
  defaultGameState,
  DerivedConstants,
  GameProps,
  GameState,
  Powerup,
} from "./interfaces";
import style from "./style.css";
import { getDerivedConstants } from "./getDerivedConstants";

const Pong: FunctionalComponent = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasRefPowerup = useRef<HTMLCanvasElement>(null);
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
    const canvasPowerup = canvasRefPowerup.current;
    const contextPowerup = canvasPowerup.getContext("2d");
    if (context && contextPowerup) {
      draw(context, contextPowerup, gameState, gameProps, derivedConstants);
    }
  }, [gameState, gameProps, derivedConstants]);

  const {
    POWERUP_CANVAS_HEIGHT,
    CANVAS_HEIGHT,
    CANVAS_WIDTH,
  } = derivedConstants;
  const [player1_score, player2_score] = gameState.players.map(
    ({ score }) => score
  );

  return (
    <div class={style.pong}>
      <div class={style.center}>
        {/* These lines of code helped testing and debugging of PowerUp Pong */}
        {DEBUG && (
          <div>
            <p>Game State: {JSON.stringify(gameState)}</p>
            <p>Game Properties: {JSON.stringify(gameProps)}</p>
          </div>
        )}
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "41%",
          }}
        >
          <h1>PowerUps</h1>
          <div id={style.squares}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <div id={style.square1}></div>
              <p class={style.squareText}>Grow</p>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <div id={style.square2}></div>
              <p class={style.squareText}>FastBall</p>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <div id={style.square3}></div>
              <p class={style.squareText}>Follow</p>
            </div>
          </div>
        </div>
        <canvas
          ref={canvasRefPowerup}
          height={POWERUP_CANVAS_HEIGHT}
          width={CANVAS_WIDTH}
          style={{ border: "1px solid purple" }}
        />
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
  ctxPowerup: CanvasRenderingContext2D,
  { CANVAS_HEIGHT, CANVAS_WIDTH, POWERUP_RADIUS }: DerivedConstants
): void => {
  ctx.fillStyle = "rgb(255, 255, 255)";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctxPowerup.fillStyle = "rgb(255, 255, 255)";
  ctxPowerup.fillRect(0, 0, CANVAS_WIDTH, POWERUP_RADIUS * 2);
};

const draw = (
  ctx: CanvasRenderingContext2D,
  ctxPowerup: CanvasRenderingContext2D,
  gameState: GameState,
  gameProps: GameProps,
  derivedConstants: DerivedConstants
): void => {
  const { powerup_radius } = gameProps;
  const {
    players: [player1, player2],
    ball: [ballX, ballY],
    powerups,
  } = gameState;
  const {
    paddle_pos: paddle1,
    powerups: powerups1,
    paddle_width: paddle1_width,
  } = player1;
  const {
    paddle_pos: paddle2,
    powerups: powerups2,
    paddle_width: paddle2_width,
  } = player2;
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

  clearCanvas(ctx, ctxPowerup, derivedConstants);

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
      ctx.fillStyle =
        type === "paddleGrow"
          ? "green"
          : type === "fastBall"
          ? "orange"
          : "purple";
      if (pos !== null) {
        const [xPos, yPos] = pos;
        ctx.fillRect(
          (xPos - powerup_radius - X_CONSTRAINTS[0]) * SCALE + HALF_PADDING,
          (yPos - powerup_radius - Y_CONSTRAINTS[0]) * SCALE + HALF_PADDING,
          2 * powerup_radius * SCALE,
          2 * powerup_radius * SCALE
        );
      }
    });
  }

  drawPowerupQueue(ctxPowerup, powerups1, CANVAS_WIDTH);
  drawPowerupQueue(ctxPowerup, powerups2, CANVAS_WIDTH, false);

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

const drawPowerupQueue = (
  ctx_powerup: CanvasRenderingContext2D,
  powerups: Powerup[],
  canvasWidth: number,
  left: boolean = true
) => {
  const POWERUP_CANVAS_WIDTH = 15;
  const POWERUP_CANVAS_OFFSET = 5;
  const MAX_POWERUPS_SHOWN = 5;
  const USED_POWERUP_BORDER = 4;
  if (powerups.length > 0) {
    powerups.forEach((powerup, i) => {
      const xPos = left
        ? POWERUP_CANVAS_OFFSET +
          i * (POWERUP_CANVAS_OFFSET + POWERUP_CANVAS_WIDTH)
        : canvasWidth -
          (POWERUP_CANVAS_OFFSET + POWERUP_CANVAS_WIDTH) * i -
          (POWERUP_CANVAS_OFFSET + POWERUP_CANVAS_WIDTH);
      const { time_used, type } = powerup;
      if (i < MAX_POWERUPS_SHOWN) {
        if (time_used !== null) {
          ctx_powerup.fillStyle = "red";
          ctx_powerup.fillRect(
            xPos - USED_POWERUP_BORDER / 2,
            POWERUP_CANVAS_OFFSET - USED_POWERUP_BORDER / 2,
            POWERUP_CANVAS_WIDTH + USED_POWERUP_BORDER,
            POWERUP_CANVAS_WIDTH + USED_POWERUP_BORDER
          );
        }
        ctx_powerup.fillStyle =
          type === "paddleGrow"
            ? "green"
            : type === "fastBall"
            ? "orange"
            : "purple";
        ctx_powerup.fillRect(
          xPos,
          POWERUP_CANVAS_OFFSET,
          POWERUP_CANVAS_WIDTH,
          POWERUP_CANVAS_WIDTH
        );
      }
    });
  }
};

// This is a small hack to make sure simultaneous viewers can be found.
const WEB_SOCKET_ID = Math.random().toString();

const client: Client = new Paho.Client(BROKER, BROKER_PORT, WEB_SOCKET_ID);

const onConnect = (client: Client) => (): void => {
  console.log("Connected!");
  client.subscribe(GAME_STATE_TOPIC);
  client.subscribe(GAME_PROPS_TOPIC);
};

const KEEP_ALIVE_INTERVAL_SEC = 60
const options: ConnectionOptions = {
  useSSL: false,
  keepAliveInterval: KEEP_ALIVE_INTERVAL_SEC,
  onSuccess: onConnect(client),
  userName: USERNAME,
  password: PASSWORD,
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
