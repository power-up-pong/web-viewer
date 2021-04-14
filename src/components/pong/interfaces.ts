/* eslint-disable @typescript-eslint/camelcase */

export interface GameState {
  paddle1: number;
  paddle2: number;
  paddle1_width: number;
  paddle2_width: number;
  ball: [number, number];
  player1_score: number;
  player2_score: number;
  powerups: Powerup[];
}

export interface Powerup {
  pos: [number, number] | null;
  type: "paddleGrow" | "fastBall";
  owner: string | null;
  time_used: number | null;
}

export interface GameProps {
  x_constraints: [number, number];
  y_constraints: [number, number];
  powerup_radius: number;
}

export interface DerivedConstants {
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
  paddle1_width: -1,
  paddle2_width: -1,
  ball: [100, 100],
  player1_score: -1,
  player2_score: -2,
  powerups: [],
};

export const defaultGameProps: GameProps = {
  x_constraints: [0, -500],
  y_constraints: [0, -500],
  powerup_radius: -2,
};
