/*
A web viewer for a Power-Up Pong game using websockets
Written by Jon Ellis (jde27), Charlie Kornoelje (cek26), and Ryan Vreeke (rjv59)
for CS 326 Final Project at Calvin University, April 2021
*/

import { FunctionalComponent, h } from "preact";
import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import { DEBUG } from "./constants";
import {
  defaultGameProps,
  defaultGameState,
  GameProps,
  GameState,
} from "./interfaces";
import style from "./style.css";
import { getDerivedConstants } from "./getDerivedConstants";
import { client, onMessageArrived } from "./wsClient";
import { draw } from "./canvasUtils";
import { PowerupLegend } from "./PowerUpLegend";
import { useConfetti } from "./useConfetti";


export const Pong: FunctionalComponent = () => {
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

  useConfetti([player1_score, player2_score]);

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
        <PowerupLegend />
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

