import {LIP_STATES} from "@/app/(authenticated)/lips/model";
import {faker} from "@faker-js/faker/locale/it";

export const standard = (/* vars, { ctx, req } */) => {
  faker.seed(20231122);
  return {
    lips: Array.from({length: 200}, (value, index) => index).map((id) => ({
      id: id,
      surname: faker.person.lastName(),
      name: faker.person.firstName(),
      date: faker.date.recent().toISOString().split("T")[0],
      state: faker.helpers.arrayElement(LIP_STATES),
    })),
  };
};
