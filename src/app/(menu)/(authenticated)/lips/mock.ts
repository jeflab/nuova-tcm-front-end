// export const standard = (/* vars, { ctx, req } */): {lips: Lip[]} => {
//   faker.seed(20231122);
//   return {
//     lips: Array(200)
//       .fill(null)
//       .map((_, id) => ({
//         id: id,
//         lipNumber: faker.string.alphanumeric(10),
//         agent: {
//           surname: faker.person.lastName(),
//           name: faker.person.firstName(),
//         },
//         contractor: {
//           surname: faker.person.lastName(),
//           name: faker.person.firstName(),
//         },
//         insuredId: faker.number.int(100),
//         createdAt: faker.date.recent(),
//         status: faker.helpers.arrayElement(lipStatuses),
//       })),
//   };
// };
