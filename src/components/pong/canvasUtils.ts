import { DEBUG } from "./constants";
import { DerivedConstants, GameProps, GameState, Powerup } from "./interfaces";

// ref: https://stackoverflow.com/a/54153800/9931154
const clearCanvases = (
  ctx: CanvasRenderingContext2D,
  ctxPowerup: CanvasRenderingContext2D,
  { CANVAS_HEIGHT, CANVAS_WIDTH, POWERUP_RADIUS }: DerivedConstants
): void => {
  ctx.fillStyle = "rgb(255, 255, 255)";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctxPowerup.fillStyle = "rgb(255, 255, 255)";
  ctxPowerup.fillRect(0, 0, CANVAS_WIDTH, POWERUP_RADIUS * 2);
};

export const draw = (
  ctx: CanvasRenderingContext2D,
  ctxPowerup: CanvasRenderingContext2D,
  gameState: GameState,
  gameProps: GameProps,
  derivedConstants: DerivedConstants
): void => {
  // get constants for the functions
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

  clearCanvases(ctx, ctxPowerup, derivedConstants);

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
      ctx.fillStyle = getPowerupColor(type);
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
  ctxPowerup: CanvasRenderingContext2D,
  powerups: Powerup[],
  canvasWidth: number,
  left: boolean = true
): void => {
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
          ctxPowerup.fillStyle = "red";
          ctxPowerup.fillRect(
            xPos - USED_POWERUP_BORDER / 2,
            POWERUP_CANVAS_OFFSET - USED_POWERUP_BORDER / 2,
            POWERUP_CANVAS_WIDTH + USED_POWERUP_BORDER,
            POWERUP_CANVAS_WIDTH + USED_POWERUP_BORDER
          );
        }
        ctxPowerup.fillStyle = getPowerupColor(type);
        ctxPowerup.fillRect(
          xPos,
          POWERUP_CANVAS_OFFSET,
          POWERUP_CANVAS_WIDTH,
          POWERUP_CANVAS_WIDTH
        );
      }
    });
  }
};

const getPowerupColor = (type: string) => {
  return type === "paddleGrow"
    ? "green"
    : type === "fastBall"
    ? "orange"
    : "purple";
};
