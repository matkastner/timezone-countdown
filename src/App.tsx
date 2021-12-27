import React from "react";
import countries from "./countries.json";
import Flags from "./Flags";
import { shuffle } from "./util";

const App: React.FC = () => {
  const shuffledCountries = shuffle(countries);

  return <Flags countries={shuffledCountries} />;
};

export default App;
