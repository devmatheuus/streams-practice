import { faker } from '@faker-js/faker';

import { createWriteStream } from 'fs';

const writeStream = createWriteStream('../data/users.csv');

writeStream.write('firstName;email;age;salary;isActive\n');

let counter = 0;

while (counter < 10000) {
  const firstName = faker.person.firstName();
  const email = faker.internet.email({ firstName });
  const age = faker.number.int({ min: 10, max: 100 });
  const salary = faker.string.numeric(4, { allowLeadingZeroes: true });
  const active = faker.datatype.boolean();

  const arr = [firstName, email, age, salary, active];

  writeStream.write(arr.join(';') + '\n');

  counter++;
}
