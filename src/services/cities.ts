import {COMUNI} from "codice-fiscale-js/src/lista-comuni";
import {matchSorter} from "match-sorter";

export interface City {
  id: number;
  cc: string;
  province: string;
  city: string;
  exist: boolean;
}

const cities: City[] = COMUNI.map(([cc, province, city, exist], index) => ({
  id: index,
  cc,
  province,
  city,
  exist: exist === "1",
}));

export function getCities(query?: string): City[] {
  if (!query) {
    return cities;
  }

  const filteredCities = cities.filter((city) =>
    city.city.toLowerCase().includes(query.toLowerCase()),
  );

  return matchSorter(cities, query.toLowerCase(), {
    keys: ["city"],
  });
}
