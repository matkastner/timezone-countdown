import React, { useEffect, useRef } from "react";
import "./App.scss";
import HueBridge from "./components/hue";
import HueContext from "./components/hue/context";
import TimeToMidnight from "./components/timezones/TimeToMidnight";
import { Country } from "./types";

interface Props {
  countries: ReadonlyArray<Country>;
}

const App: React.FC<Props> = ({ countries }) => {
  return (
    <div className="App">
      <HueContext.Provider value={HueBridge}>
        <TimeToMidnight timezone="UTC" />
      </HueContext.Provider>
    </div>
  );
};

export function useInterval(callback: () => void, delay: number) {
  const savedCallback = useRef<() => void>();

  // Remember the latest function.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback && savedCallback.current && savedCallback.current();
    }

    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export default App;
