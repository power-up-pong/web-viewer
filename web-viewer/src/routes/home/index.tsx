import { FunctionalComponent, h } from "preact";
import { useEffect, useRef } from "preact/hooks";
import Paho, { Message, ConnectionOptions } from "paho-mqtt";
import style from "./style.css";

// useful commands:
// mosquitto_pub -t cs326/jcalvin -m "Hello World" -h mqtt.eclipseprojects.io
// mosquitto_sub -h mqtt.eclipseprojects.io -t cs326/jcalvin
// mosquitto_sub -h iot.cs.calvin.edu -t pup/ctrl1 -u cs326 -P piot
// https://medium.com/@pdx.lucasm/canvas-with-react-js-32e133c05258

const BROKER = "mqtt.eclipseprojects.io/mqtt";
const BROKER_PORT = 80;

const Home: FunctionalComponent = () => {
  const client = new Paho.Client(BROKER, BROKER_PORT, "clientjs");

  const onConnect = () => {
    console.log("Connected!");
    client.subscribe("pup/game");
  };
  const options: ConnectionOptions = {
    useSSL: false,
    keepAliveInterval: 60,
    onSuccess: onConnect,
    // userName: "cs326",
    // password: "piot"
  };
  client.connect(options);

  const onMessageArrived = (message: Message) => {
    console.log("Message Arrived:" + message.payloadString);
    // document.getElementById("msg")!.innerHTML += message.payloadString + "\n";
  };
  client.onMessageArrived = onMessageArrived;

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.arc(50, 100, 20, 0, 2 * Math.PI);
    ctx.fill();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    //Our first draw
    if (context) {
      context.fillStyle = "#000000";
      context.fillRect(10, 10, 50, 50);
      draw(context);
    }
  }, [draw]);

  return (
    <div class={style.home}>
      <h1>Home</h1>
      <p>This is the Home component.</p>
      <p>Hello there</p>
      <p id="msg"></p>
      <canvas
        ref={canvasRef}
        id="myCanvas"
        height={500}
        width={500}
        style={{ border: "1px solid green" }}
      />
    </div>
  );
};

export default Home;
