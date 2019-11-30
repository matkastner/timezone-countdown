import classNames from "classnames";
import moment from "moment";
import React from "react";
import { getDurationToMidnight } from "../../util";
import { InjectedHueProps, withHueBridge } from "../hue/context";

interface Props extends InjectedHueProps {
  timezone: string;
}

const TimeToMidnight: React.FC<Props> = ({ timezone, bridge }) => {
  const durationToMidnight: any = getDurationToMidnight(moment(), timezone);

  if (durationToMidnight.minutes() <= 1) {
    return (
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
    );
  }

  return (
    <div
      key={durationToMidnight.minutes()}
      className="py-3 animated fadeOut slower delay-30s tx-info"
    >
      {" "}
      <div className="text-shadow ">{bridge && bridge.ip}</div>
      <div className="display-1 text-shadow text-center">in {timezone}</div>
      <div className="display-4 text-shadow text-center animated pulse">
        it'll be midnight in{" "}
        <strong className="monospace">{durationToMidnight.format()}</strong>
      </div>
    </div>
  );
};

export default withHueBridge(TimeToMidnight);
