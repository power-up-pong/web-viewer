import { FunctionalComponent, h } from "preact";
import { useEffect, useRef } from "preact/hooks";
import Paho, { Message, ConnectionOptions, Client } from "paho-mqtt";
import style from "./style.css";

// useful commands:
// mosquitto_pub -t cs326/jcalvin -m "Hello World" -h mqtt.eclipseprojects.io
// mosquitto_sub -h mqtt.eclipseprojects.io -t cs326/jcalvin
// mosquitto_sub -h iot.cs.calvin.edu -t pup/ctrl1 -u cs326 -P piot
// https://medium.com/@pdx.lucasm/canvas-with-react-js-32e133c05258

const BROKER = "mqtt.eclipseprojects.io/mqtt";
const BROKER_PORT = 80;
const USERNAME = "cs326";
const PASSWORD = "piot";

const Home: FunctionalComponent = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const client: Client = new Paho.Client(BROKER, BROKER_PORT, "clientjs");
  const options: ConnectionOptions = {
    useSSL: false,
    keepAliveInterval: 60,
    onSuccess: onConnect(client),
    // userName: USERNAME,
    // password: PASSWORD,
  };
  client.connect(options);
  client.onMessageArrived = onMessageArrived;

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    //Our first draw
    if (context) {
      draw(context);
    }
  }, []);

  return (
    <div class={style.home}>
      <h1>Power Up Pong!</h1>
      <canvas
        ref={canvasRef}
        height={500}
        width={500}
        style={{ border: "1px solid green" }}
      />
    </div>
  );
};

export default Home;

const draw = (ctx: CanvasRenderingContext2D): void => {
  ctx.fillStyle = "#000000";
  ctx.fillRect(10, 10, 50, 50);
  ctx.fillStyle = "#000000";
  ctx.beginPath();
  ctx.arc(50, 100, 20, 0, 2 * Math.PI);
  ctx.fill();
};

const onConnect = (client: Client) => () => {
  console.log("Connected!");
  client.subscribe("pup/game");
};

const onMessageArrived = (message: Message): void => {
  console.log(`Message Arrived: ${message.payloadString}`);
};
