/* eslint-disable @typescript-eslint/camelcase */

export interface GameState {
  paddle1: number;
  paddle2: number;
  ball: [number, number];
  player1_score: number;
  player2_score: number;
}

export interface GameProps {
  paddle_width: number;
  x_constraints: [number, number];
  y_constraints: [number, number];
  powerup_radius: number;
}

export interface DerivedConstants {
  PADDLE_WIDTH: number;
  X_CONSTRAINTS: [number, number];
  Y_CONSTRAINTS: [number, number];
  POWERUP_RADIUS: number;
  CANVAS_PADDING: number;
  SCALE: number;
  CANVAS_HEIGHT: number;
  CANVAS_WIDTH: number;
}

export const defaultGameState: GameState = {
  paddle1: 50,
  paddle2: 60,
  ball: [100, 100],
  player1_score: -1,
  player2_score: -2,
};

export const defaultGameProps: GameProps = {
  paddle_width: -1,
  x_constraints: [0, -500],
  y_constraints: [0, -500],
  powerup_radius: -2,
};
