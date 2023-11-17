import { createReadStream, createWriteStream } from 'fs';
import { Transform, Writable } from 'stream';
import { pipelineAsync } from './utils/pipeline-async.js';
import csv from 'csvtojson';

const FILE_PATH = './data/users.csv';
const fileStream = createReadStream(FILE_PATH);

const normalizeDataStream = new Transform({
  objectMode: true,
  transform(chunk, encoding, callback) {
    const user = {
      firstName: chunk.firstName,
      email: chunk.email.toLowerCase(),
      age: +chunk.age,
      salary: +chunk.salary,
      isActive: chunk.isActive === 'true',
    };

    callback(null, user);
  },
});

const filterDataStream = new Transform({
  objectMode: true,
  transform(chunk, encoding, callback) {
    if (!chunk.isActive) {
      callback(null);
      return;
    }

    callback(null, chunk);
  },
});

const saveDataInLocalJson = new Writable({
  objectMode: true,
  write(chunk, encoding, callback) {
    createWriteStream('./data/users.json', { flags: 'a' }).write(
      JSON.stringify(chunk) + '\n'
    );

    callback(null);
  },
});

try {
  await pipelineAsync(
    fileStream,
    csv({ delimiter: ';' }, { objectMode: true }),
    normalizeDataStream,
    filterDataStream,
    saveDataInLocalJson
  );
  console.log('Done!');
} catch (error) {
  console.error(error);
}
