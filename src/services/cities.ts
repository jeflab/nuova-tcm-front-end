"use server";

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
  exist: exist === 1,
}));

export async function getCities(
  query?: string,
  onlyExisting: boolean = false,
): Promise<City[]> {
  const safeQuery = query ?? "";

  const filteredCities = cities.filter((city) => {
    return (
      city.city.toLowerCase().includes(safeQuery.toLowerCase()) &&
      (!onlyExisting || city.exist)
    );
  });

  return matchSorter(filteredCities, safeQuery.toLowerCase(), {
    keys: ["city"],
  });
}
