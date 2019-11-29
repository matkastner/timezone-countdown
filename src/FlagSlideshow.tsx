import React, { useState } from "react";
import { useInterval } from "./App";
import { Country } from "./types";

interface Props {
  countries: ReadonlyArray<Country>;
}

const FlagSlideshow: React.FC<Props> = ({ countries }) => {
  const [current, setCurrent] = useState(0);
  const [colours, setColours] = useState<ReadonlyArray<string>>(["#ffffff"]);

  useInterval(() => {
    const next = current < countries.length - 1 ? current + 1 : 0;

    setCurrent(next);
    fetch(countries[next].flag)
      .then(response => response.text())
      .then(svg => {
        console.log(svg);
        const matches = svg.match(/#([a-zA-Z0-9]{3,6})/gi);

        if (matches) {
          const result = matches.filter(
            (value, index, self) => self.indexOf(value) === index
          );
          setColours(result);
        } else {
          setColours(["#FFF"]);
        }
      });
  }, 10000);

  return (
    <div>
      {colours.map(colour => (
        <div style={{ background: colour }}>{colour}</div>
      ))}
      <img src={countries[current].flag} width={300} />
    </div>
  );
};

export default FlagSlideshow;
