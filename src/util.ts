import moment from "moment";
import { Country } from "./types";

const countryTimezoneMapping: { [alpha2Code: string]: string } = {
  GB: "UTC+00:00",
  FR: "UTC+01:00",
  DK: "UTC+01:00",
};

export function mapCountriesToTimezones(countries: ReadonlyArray<Country>): {
  [tz: string]: ReadonlyArray<Country>;
} {
  return countries.reduce((acc: { [tz: string]: Country[] }, c) => {
    if (countryTimezoneMapping[c.alpha2Code]) {
      const timezone = countryTimezoneMapping[c.alpha2Code];
      acc[timezone] = [...(acc[timezone] || []), c];

      return acc;
    }

    c.timezones.forEach((timezone: string) => {
      if (timezone === "UTC") {
        timezone = "UTC+00:00";
      }
      if (timezone === "UTC+11") {
        timezone = "UTC+11:00";
      }
      if (timezone === "UTC+04") {
        timezone = "UTC+04:00";
      }

      acc[timezone] = [...(acc[timezone] || []), c];
    });

    return acc;
  }, {});
}

export function getDurationToMidnight(from: moment.Moment, timezone: string) {
  const offset = timezone.replace("UTC", "");
  const localTime = from.clone().utcOffset(offset);
  const localMidnight = localTime.clone().endOf("day");

  return moment.duration(localMidnight.diff(localTime));
}

export function sortTimezonesByTimeToMidnight(
  from: moment.Moment,
  timezones: ReadonlyArray<string>
): ReadonlyArray<string> {
  return timezones
    .map((tz) => ({ tz, dtm: getDurationToMidnight(from, tz) }))
    .sort((a, b) => a.dtm.asMilliseconds() - b.dtm.asMilliseconds())
    .map((x) => x.tz);
}

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
export function shuffle<T>(a: T[]): ReadonlyArray<T> {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
