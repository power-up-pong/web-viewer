import { FunctionalComponent, h } from "preact";
import Header from "./header";
import Pong from "./pong";

const App: FunctionalComponent = () => {
  return (
    <div id="app">
      <Header />
      <Pong />
    </div>
  );
};

export default App;
