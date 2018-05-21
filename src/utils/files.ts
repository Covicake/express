import * as fs from 'fs';

export function loadData(callback) {
  fs.readFile('data.txt', 'utf8', (err, data) => {
    if (err) {
      callback([]);
    } else {
      callback(JSON.parse(data));
    }
  });
}

export function saveData(movies, callback) {
  fs.writeFile('data.txt', JSON.stringify(movies), (err) => {
    if (err) {
      callback(err);
    } else {
      callback();
    }
  });
}
