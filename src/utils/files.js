const fs = require('fs');

module.exports = {
  loadData,
  saveData
}

function loadData(callback){
  fs.readFile('data.txt', "utf8", (err, data) => {
    if(err){
      callback([]);
    }else{
      callback(JSON.parse(data));
    }
  });
}

function saveData(movies, callback){
  fs.writeFile('data.txt', JSON.stringify(movies), err =>{
    if(err){
      callback(err);
    }else{
      callback();
    }
  });
}
