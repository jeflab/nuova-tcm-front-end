import {Lip, lipStatuses} from "@/entities/lip";
import {faker} from "@faker-js/faker/locale/it";

export const standard = (/* vars, { ctx, req } */): {lips: Lip[]} => {
  faker.seed(20231122);
  return {
    lips: Array(200)
      .fill(null)
      .map((_, id) => ({
        id: id,
        lipNumber: faker.string.alphanumeric(10),
        agent: {
          surname: faker.person.lastName(),
          name: faker.person.firstName(),
        },
        contractorId: faker.number.int(100),
        insuredId: faker.number.int(100),
        createdAt: faker.date.recent(),
        status: faker.helpers.arrayElement(lipStatuses),
      })),
  };
};
