/* eslint-disable @typescript-eslint/camelcase */

export interface GameState {
  players: [PlayerState, PlayerState];
  ball: [number, number];
  powerups: Powerup[];
}

export interface PlayerState {
  id: number;
  score: number;
  paddle_pos: number;
  paddle_width: number;
  powerups: Powerup[];
}

export interface Powerup {
  pos: [number, number] | null;
  type: "paddleGrow" | "fastBall" | "trackBall";
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

export const defaultPlayerState: PlayerState = {
  id: 1,
  score: -1,
  paddle_pos: 100,
  paddle_width: 200,
  powerups: [],
};

export const defaultGameState: GameState = {
  players: [defaultPlayerState, defaultPlayerState],
  ball: [100, 100],
  powerups: [],
};

export const defaultGameProps: GameProps = {
  x_constraints: [-100, 1123],
  y_constraints: [-100, 1123],
  powerup_radius: 20,
};
