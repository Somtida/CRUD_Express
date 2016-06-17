'use strict';
const fs = require('fs');
const path = require('path');
const uuid = require('uuid');
const moment = require('moment');
const dataPath = path.join(__dirname, 'messages.json');

exports.get = (sortby, cb) =>{
  // console.log("sortby: ",sortby);
  if(sortby === undefined){
    console.log("do in if === undefined");
    readMsg(cb);
  }else{
    // console.log("do in else");
    readMsg((err, messages)=>{
      messages = messages.sort((a,b) => {
          switch (sortby){
          case "date":
            return b[sortby] - a[sortby];
          case "author":
            var x = a[sortby].toLowerCase();
            var y = b[sortby].toLowerCase();
            return x < y ? -1 : x > y ? 1 : 0;
          case "text":
            var x = a[sortby].toLowerCase();
            var y = b[sortby].toLowerCase();
            return x < y ? -1 : x > y ? 1 : 0;
          }
      });
      console.log("messages: ",messages);
      cb(null,messages);
      // writeMsg(messages,cb);
    });
  }

}


exports.getOne = (id, cb) => {
  readMsg((err, messages) => {
    var msgtxt = messages.filter(message =>{
      if(message.id === id){
        return message;
      }
    });
    cb(null,msgtxt[0]);
  });
}


exports.create = (author,newMsg, cb) => {
  readMsg((err, messages)=>{
    console.log("author: ",author);
    let msgObj = {
      author: author,
      text: newMsg,
      date: Date.now(),
      createAt: moment().format('MMMM Do YYYY'),
      id: uuid()
    }
    messages.push(msgObj);

    writeMsg(messages, cb);
  });
}

exports.update = (id,newMsg, cb) => {
  readMsg((err, messages)=>{
    messages = messages.map( message => {
      if(message.id === id){
        message.text = newMsg;
        return message;
      }else{
        return message;
      }

    });

    writeMsg(messages, cb);

  });
}


exports.delete = (id, cb) => {
  readMsg((err, messages) => {
    messages = messages.filter( message => message.id !== id);
    writeMsg(messages,cb);
  });
}

function writeMsg(messages, cb){
  fs.writeFile(dataPath, JSON.stringify(messages),cb);
}

function readMsg(cb){
  fs.readFile(dataPath, (err, data)=>{
    if(err) return cb(err);
    try{
      var messages = JSON.parse(data);
    }catch(e){
      var messages = [];
    }
    cb(null, messages);
  });
}
