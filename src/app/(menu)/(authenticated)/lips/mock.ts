import {lipStates} from "@/app/(menu)/(authenticated)/lips/model";
import {faker} from "@faker-js/faker/locale/it";

export const standard = (/* vars, { ctx, req } */) => {
  faker.seed(20231122);
  return {
    lips: Array(200)
      .fill(null)
      .map((_, id) => ({
        id: id,
        surname: faker.person.lastName(),
        name: faker.person.firstName(),
        date: faker.date.recent().toISOString().split("T")[0],
        state: faker.helpers.arrayElement(lipStates),
      })),
  };
};
