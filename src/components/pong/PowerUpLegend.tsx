import { FunctionalComponent, h } from "preact";
import { PowerupLegendEntry } from "./PowerupLegendEntry";
import style from "./style.css";

export const PowerupLegend: FunctionalComponent = () => {
  return (
    <div
      style={{
        display: "flex",
      }}
    >
      <h1>PowerUps</h1>
      <div id={style.squares}>
        <PowerupLegendEntry text="Grow" squareStyle={style.square1} />
        <PowerupLegendEntry text="Fast Ball" squareStyle={style.square2} />
        <PowerupLegendEntry text="Follow" squareStyle={style.square3} />
      </div>
    </div>
  );
};
