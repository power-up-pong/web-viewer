import { DerivedConstants, GameProps } from "./interfaces";

/* get constants related to the game props */
export const getDerivedConstants = ({
  powerup_radius,
  x_constraints,
  y_constraints,
}: GameProps): DerivedConstants => {
  const X_CONSTRAINTS = x_constraints;
  const Y_CONSTRAINTS = y_constraints;
  const POWERUP_RADIUS = powerup_radius;
  const CANVAS_PADDING = 20;
  const SCALE = 0.5;
  const POWERUP_CANVAS_HEIGHT = 25;
  const CANVAS_HEIGHT =
    (Y_CONSTRAINTS[1] - Y_CONSTRAINTS[0]) * SCALE + CANVAS_PADDING;
  const CANVAS_WIDTH =
    (X_CONSTRAINTS[1] - X_CONSTRAINTS[0]) * SCALE + CANVAS_PADDING;

  return {
    X_CONSTRAINTS,
    Y_CONSTRAINTS,
    POWERUP_RADIUS,
    CANVAS_PADDING,
    SCALE,
    POWERUP_CANVAS_HEIGHT,
    CANVAS_HEIGHT,
    CANVAS_WIDTH,
  };
};
