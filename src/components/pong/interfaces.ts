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

export const defaultGameState: GameState = {
  paddle1: 50,
  paddle2: 60,
  ball: [50, 50],
  player1_score: -1,
  player2_score: -2,
};

export const defaultGameProps: GameProps = {
  paddle_width: -1,
  x_constraints: [0, -500],
  y_constraints: [0, -500],
  powerup_radius: -2,
};