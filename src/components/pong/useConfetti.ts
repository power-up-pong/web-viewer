import confetti, { Origin } from "canvas-confetti";
import { useEffect } from "preact/hooks";

// Angles for each of the player's confetti shots.
const P1_ANGLE = 60;
const P2_ANGLE = 120;

/** Shoots some confetti */
const celebrate = (angle: number, origin: Origin) => {
  confetti({
    particleCount: 100,
    angle,
    spread: 55,
    origin,
  });
};

/** Adds confetti to the player that scores */
export const useConfetti = ([player1Score, player2Score]: [number, number]) => {
  useEffect(() => {
    player1Score > 0 && celebrate(P1_ANGLE, { x: 0 });
  }, [player1Score]);

  useEffect(() => {
    player2Score > 0 && celebrate(P2_ANGLE, { x: 1 });
  }, [player2Score]);
};
