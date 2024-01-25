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

export function getCities(
  query?: string,
  onlyExisting: boolean = false,
): City[] {
  console.log("getCities", query, onlyExisting);

  const safeQuery = query ?? "";
  console.log("safeQuery", safeQuery);

  const filteredCities = cities.filter((city) => {
    return (
      city.city.toLowerCase().includes(safeQuery.toLowerCase()) &&
      (!onlyExisting || city.exist)
    );
  });

  console.log("filteredCities", filteredCities);
  console.log(
    "orderedCities",
    matchSorter(filteredCities, safeQuery.toLowerCase(), {
      keys: ["city"],
    }),
  );

  return matchSorter(filteredCities, safeQuery.toLowerCase(), {
    keys: ["city"],
  });
}
