export const DEBUG = false;

/* Broker constants */
export const BROKER = "mqtt.eclipseprojects.io/mqtt";
export const BROKER_PORT = 80;
export const USERNAME = "cs326";
export const PASSWORD = "piot";

/* Topic strings */
export const GAME_STATE_TOPIC = "pup/game"
export const GAME_PROPS_TOPIC = "pup/game-props"

/* sizing topics */
// TODO: replace this with received props
const PADDLE_WIDTH = 50;
const MAX_WIDTH = 1023;
const PADDLE_HALF = PADDLE_WIDTH / 2; // TODO: should this be int division?
const X_CONSTRAINTS = [0, MAX_WIDTH + PADDLE_HALF];
const Y_CONSTRAINTS = [0, MAX_WIDTH + PADDLE_HALF];
const MAX = X_CONSTRAINTS[1];
export const SCALE = 2;
export const SCALED_MAX = MAX / SCALE;