import { FunctionalComponent, h } from "preact";
import style from "./style.css";

interface PowerupLegendEntryProps {
  text: string;
  squareStyle: string;
}

/** One entry in a the powerup legend */
export const PowerupLegendEntry: FunctionalComponent<PowerupLegendEntryProps> = ({
  text,
  squareStyle,
}: PowerupLegendEntryProps) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <div id={squareStyle} />
      <p class={style.squareText}>{text}</p>
    </div>
  );
};
