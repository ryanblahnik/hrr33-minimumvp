const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
var moment = require('moment');
var http = require('http');
var https = require('https');
const db = require('./db.js');

//
var theport = process.env.PORT || 8080;

const appServer = express();
appServer.use(express.static(__dirname));
appServer.use('/scripts', express.static(
  path.join(__dirname, '..', 'node_modules')));

appServer.use(bodyParser.urlencoded({ extended: false }));
appServer.use(bodyParser.json());

appServer.post('/', (req, res) => {
  if (req.body.result) {
    var data = {
      result: req.body.result,
      time: moment(req.body.time).format('dddd, YYYY MMMM D, h:mm:ss a')
    };
    db.save(null, data, function(err, total) {
      res.status(201).end(JSON.stringify(total));
    });
  } else if (req.body.cheat) {
    db.updateResult(null, req.body.changing, function(err, total) {
      res.status(201).end(JSON.stringify(total));
    });
  } else if (req.body.drop) {
    db.deleteHistory(null, function(err, newTotal) {
      if (err) {
        console.error(`server drop error: ${err}`);
        res.end();
      } else {
        res.status(201).end(JSON.stringify([]));
      }
    });
  } else {
    db.save(null, null, function(err, total) {
      res.status(201).end(JSON.stringify(total));
    });
  }
});

appServer.get('/*', (req, res) => {
  res.status(200).end();
});

appServer.listen(theport, () => {
  console.log(`Flip server listening on :${theport}`)
});