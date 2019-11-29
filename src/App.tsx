import classNames from "classnames";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import Card from "react-bootstrap/Card";
import Carousel from "react-bootstrap/Carousel";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import NumberFormat from "react-number-format";
import "./App.scss";
import { Country } from "./types";
import {
  getDurationToMidnight,
  mapCountriesToTimezones,
  sortTimezonesByTimeToMidnight
} from "./util";

interface Props {
  countries: ReadonlyArray<Country>;
}

const App: React.FC<Props> = ({ countries }) => {
  const [now, setNow] = useState(moment.utc());
  const [debug, setDebug] = useState(false);

  useInterval(() => {
    setNow(moment.utc());
  }, 1000);

  const timezones = mapCountriesToTimezones(countries);
  const sortedTimezones = sortTimezonesByTimeToMidnight(
    moment.utc(),
    Object.keys(timezones)
  );

  if (!sortedTimezones[0]) {
    return <div>No timezones found!</div>;
  }

  const nextTimezone = sortedTimezones[0];
  const nextCountries = timezones[nextTimezone];

  const durationToMidnight: any = getDurationToMidnight(now, nextTimezone);

  return (
    <div className="App" onClick={() => setDebug(!debug)}>
      {durationToMidnight.asMinutes() > 1 ? (
        <div
          key={debug + durationToMidnight.minutes()}
          className="py-3 animated fadeOut slower delay-30s tx-info"
        >
          <div className="display-1 text-shadow text-center">
            in {nextTimezone}
          </div>
          <div className="display-4 text-shadow text-center animated pulse">
            it'll be midnight in{" "}
            <strong className="monospace">{durationToMidnight.format()}</strong>
          </div>
        </div>
      ) : (
        <div
          className={`d-flex align-items-center justify-content-center countdown`}
        >
          <div className="countdown-background animated fadeIn"></div>
          <div
            key={durationToMidnight.seconds()}
            className={classNames("countdown-text monospace text-shadow", {
              heartBeat: durationToMidnight.seconds() <= 10
            })}
          >
            {durationToMidnight.seconds()}
          </div>
        </div>
      )}
      {debug && (
        <Container>
          <Card className="m-3">
            <Card.Header>Coming up next...</Card.Header>
            <ListGroup variant="flush">
              {sortedTimezones.map(tz => (
                <ListGroup.Item>
                  <div>
                    {tz} ({getDurationToMidnight(now, tz).humanize(true)})
                  </div>
                  <small className="text-muted">
                    {timezones[tz].map(c => c.name).join(", ")}
                  </small>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
          <Card className="m-3">
            <Card.Header>Countries</Card.Header>
            <ListGroup variant="flush">
              {countries
                .slice()
                .sort((a, b) => b.timezones.length - a.timezones.length)
                .map(c => (
                  <ListGroup.Item>
                    <div>
                      <strong>{c.alpha2Code}</strong> {c.name}/{c.nativeName}
                    </div>
                    <small className="text-muted">
                      {c.timezones.join(", ")}
                    </small>
                  </ListGroup.Item>
                ))}
            </ListGroup>
          </Card>
        </Container>
      )}
      <Carousel
        className="country-carousel"
        fade
        indicators={false}
        controls={false}
        interval={moment.duration(1, "minute").asMilliseconds()}
      >
        {nextCountries.map(c => (
          <Carousel.Item key={c.numericCode}>
            <div
              className="d-flex align-items-center justify-content-center min-vh-100 country"
              style={{ backgroundImage: `url(${c.flag})` }}
            />

            <Carousel.Caption className="animated fadeIn slower delay-30s">
              <h2 className="text-shadow">
                {c.timezones.length > 0 && "in parts of "}
                {c.nativeName}
                {c.nativeName !== c.name && ` (${c.name}, ${c.region})`}
              </h2>
              <h4 className="text-shadow">
                Population:{" "}
                <NumberFormat
                  value={c.population}
                  displayType={"text"}
                  thousandSeparator
                ></NumberFormat>{" "}
                &#8226; Size:{" "}
                <NumberFormat
                  value={c.area}
                  displayType={"text"}
                  thousandSeparator
                ></NumberFormat>{" "}
                km<sup>2</sup>
              </h4>
              <span className="text-shadow">
                The capital city of {c.name} is <strong>{c.capital}</strong> and
                the currency is{" "}
                <strong>
                  {c.currencies
                    .map(cu => `${cu.name} (${cu.symbol})`)
                    .join(", ")}
                </strong>
                .
              </span>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

function useInterval(callback: () => void, delay: number) {
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
