import { FunctionalComponent, h } from "preact";
import style from "./style.css";
import Paho, { Message } from "paho-mqtt";

// useful commands:
// mosquitto_pub -t cs326/jcalvin -m "Hello World" -h mqtt.eclipseprojects.io
// mosquitto_sub -h mqtt.eclipseprojects.io -t cs326/jcalvin

const Home: FunctionalComponent = () => {
  const client = new Paho.Client("mqtt.eclipseprojects.io/mqtt", 80, "clientjs");
  var options = {
    useSSL: false,
    keepAliveInterval: 60,
    onSuccess: onConnect,
  };
  client.connect(options);
  function onConnect() {
    console.log("Connected!");
    client.subscribe("cs326/jcalvin");
  }

  const onMessageArrived = (message: Message) => {
    console.log("Message Arrived:" + message.payloadString);
    document.getElementById("msg")!.innerHTML += message.payloadString + "\n";
  };
  client.onMessageArrived = onMessageArrived;

  return (
    <div class={style.home}>
      <h1>Home</h1>
      <p>This is the Home component.</p>
      <p>Hello there</p>
      <p id="msg"></p>
    </div>
  );
};

export default Home;
