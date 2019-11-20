export interface Country {
  name: string;
  topLevelDomain: ReadonlyArray<string>;
  alpha2Code: string;
  alpha3Code: string;
  callingCodes: ReadonlyArray<string>;
  capital: string;
  altSpellings: ReadonlyArray<string>;
  region: string;
  subregion: string;
  population: number;
  latlng: [number, number];
  demonym: string;
  area: number;
  gini: number;
  timezones: ReadonlyArray<string>;
  borders: ReadonlyArray<string>;
  nativeName: string;
  numericCode: string;
  currencies: [{ code: string; name: string; symbol: string }];
  languages: ReadonlyArray<{
    iso639_1: string;
    iso639_2: string;
    name: string;
    nativeName: string;
  }>;
  translations: {
    [language: string]: string;
  };
  flag: string;
  regionalBlocs: ReadonlyArray<{
    acronym: string;
    name: string;
    otherAcronyms: ReadonlyArray<string>;
    otherNames: ReadonlyArray<string>;
  }>;
  cioc: string;
}
