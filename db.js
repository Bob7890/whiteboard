const MongoClient = require('mongodb').MongoClient;
const { mongoURL } = require('./config.js');
// const url = `mongodb://${process.env.db_username}:${process.env.db_password}@ds037814.mongolab.com:37814/heroku_1cjc54ck`;
const url = mongoURL.local;

let state = {
  db: null,
};

function connect(callback) {
  if (state.db) return callback();
  MongoClient.connect(url, function(err, db) {
    if (err) return callback(err);
    state.db = db;
    callback(); // error parameter undefined
  });
}

function get() {
  return state.db;
}

function getStrokes(callback) {
  if (!state.db) throw new Error('Not connected to DB');
  let strokeColl = state.db.collection('stroke');
  strokeColl.find().toArray(function(err, docs) {
    callback(err, docs);
  });
}

function getChats(callback) {
  if (!state.db) throw new Error('Not connected to DB');
  let chatColl = state.db.collection('chat');
  chatColl.find().sort({date: 1}).toArray(function(err, docs) {
    callback(err, docs);
  });
}

function addStroke(obj) {
  if (!state.db) throw new Error('Not connected to DB');
  let strokeColl = state.db.collection('stroke');
  // console.log('trying to insert', obj);
  strokeColl.insertOne(obj, function(err) {
    if (err) throw err;
  });
}

function addChat(obj) {
  if (!state.db) throw new Error('Not connected to DB');
  let chatColl = state.db.collection('chat');
  chatColl.insertOne(obj, function(err) {
    if (err) throw err;
  });
}

function clearStrokes() {
  if (!state.db) throw new Error('Not connected to DB');
  let strokeColl = state.db.collection('stroke');
  strokeColl.deleteMany({});
}

function close(callback) {
  if (state.db) {
    state.db.close(function(err, result) {
      state.db = null;
      callback(err);
    });
  }
}

module.exports = {
  connect,
  get,
  getStrokes,
  getChats,
  addStroke,
  addChat,
  clearStrokes,
  close,
};