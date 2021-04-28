export const DEBUG = false;

/* Broker constants */
export const BROKER = "iot.cs.calvin.edu";
export const BROKER_PORT = 8080;
export const USERNAME = "cs326";
export const PASSWORD = "piot";
// For testing at home
//export const BROKER = "mqtt.eclipseprojects.io/mqtt";
//export const BROKER_PORT = 80;

/* Topic strings */
export const GAME_STATE_TOPIC = "pup/game";
export const GAME_PROPS_TOPIC = "pup/game-props";

/* Additional Constants */
export const KEEP_ALIVE_INTERVAL_SEC = 60;
// This is a small hack to make sure simultaneous viewers can be found.
export const WEB_SOCKET_ID = Math.random().toString();
