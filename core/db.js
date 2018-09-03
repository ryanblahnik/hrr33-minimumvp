var mongoose = require('mongoose');
var Promise = require('bluebird');

mongoose.connect('mongodb://localhost/flips', { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'db connection error:'));
db.once('open', function() {
  console.log('db connected on :27017');
});

var historySchema = new mongoose.Schema({
  _id: Number,
  result: String,
  moment: String
}, { versionKey: false });

var Result = mongoose.model('Result', historySchema);

let counter = 0;

const setCounter = function() {
  Result.find().exec(function(err, data) {
    if (err) {
      console.error(`db length check error: ${err}`);
    } else {
      counter = data.length;
    }
  })
};

const save = function(err, data, callback) {
  if (err) {
    console.error(`db save error: ${err}`);
  } else {
    if (data) {
      setCounter();
      // Result.find().exec(function(err, data) {
      //   if (err) {
      //     console.error(`db length check error: ${err}`);
      //   } else {
      //     // console.log(data.length);
      //     counter = data.length;
      //   }
      // })
      var record = {
        _id: counter,
        result: data.result,
        moment: data.time
      }
      let storing = new Result(record);
      storing.save(function(err, storing) {
        if (err) {
          console.error(`db save err: ${err}`);
        } else {
          counter += 1;
          // callback(null, data);
          Result.find().exec(function(err, total) {
            if (err) {
              console.error(`db retrieve error: ${err}`);
            } else {
              callback(null, total);
            }
          })
        }
      });
    } else {
      Result.find().exec(function(err, total) {
        if (err) {
          console.error(`db retrieve error: ${err}`);
        } else {
          callback(null, total);
        }
      })
    }
  }
};

const deleteHistory = function(err, callback) {
  if (err) {
    console.error(`db delete error: ${err}`);
  } else {
    callback(null, 'db table cleared');
  }
};

const updateResult = function(err, entry, callback) {
  if (err) {
    console.error(`db update error: ${err}`);
  } else {
    callback(null, 'db entry changed');
  }
};

// let retrieving = (callback) => {
//   Result.find(function(err, data) {
//     if (err) {
//       console.error(err);
//     } else {
//       console.log(`db retrieving data: ${data}`);
//     }
//   }).exec(function(err, data) {
//     if (err) {
//       console.error(`db retrieve error: ${err}`);
//     } else {
//       callback(null, `db table retrieved`);
//     }
//   })
// };


module.exports.save = save;
module.exports.deleteHistory = deleteHistory;
module.exports.updateResult = updateResult;