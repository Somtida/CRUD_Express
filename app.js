'use strict';
const PORT = 8000;
const path = require('path');
const express = require('express');
const Msg = require('./message.js');
const bodyParser = require('body-parser');
const morgan = require('morgan');
let app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//static routing!! (frontend css, js, etc.)
app.use(express.static('public'));

app.get('/', (req, res) => {
  let indexPath = path.join(__dirname, 'index.html');
  res.sendFile(indexPath);
});

function authMiddleware(req, res, next){
  //if(req.query.sort === 'author'){
    // res.status(401); //401 is unauthorized
    //res.send(`Sorted by `+ req.query.sort);
    // return;
    console.log("sort: ", req.query.sort);
    Msg.sortObj(req.query.sort, (err, messages) => {
      if(err) return res.status(400);
      res.send("sorted: ",messages);
    });
  // }
  next();
}

// app.use(authMiddleware);

// app.get('/messages', (req, res) => {
//
// });


app.get('/messages', (req, res)=>{
  console.log("req.query: ",req.query.sort);
  Msg.get(req.query.sort, (err, messages)=>{
    if(err) return res.status(400).send(err);
    res.send(messages);
  });
});
// app.get('/messages', (req, res)=>{
//   console.log("req.query: ",req.query.sort);
//   Msg.get((err, messages)=>{
//     if(err) return res.status(400).send(err);
//     res.send(messages);
//   });
// });


//app.get('/messages', (req, res)=>{
//   console.log("req.query: ",req.query.sort);
//   Msg.get((err, messages)=>{
//
//     res.status(err ? 400: 200).send(err || messages);
//   });
// });

app.get('/messages/:id', (req, res)=>{
  Msg.getOne(req.params.id, (err,messages) => {
    if(err) return res.status(400).send(err);
    res.send(`${messages.author}\'s text: ${messages.text}`);
  });
});

app.post('/messages', function (req, res){
  // console.log("req.body.author: ",req.body);
  Msg.create(req.body.author, req.body.text ,err => {
    if(err) return res.status(400).send(err);
    res.send("posted");
  });
});

app.delete('/messages/:id', (req, res) => {
  Msg.delete(req.params.id, err => {
    if(err) return res.status(400).send(err);
    res.send("deleted");
  });
});

app.put('/messages/:id/:newMsg', (req, res) => {
  // console.log(`req.params.id: ${req.params.id}\nreq.params.newMsg: ${req.params.newMsg}`);
  Msg.update(req.params.id, req.params.newMsg, err =>{
    if(err) return res.status(400).send(err);

    res.send("updated");
  });
});

app.listen(PORT, err=>{
  console.log(err || `Express listening on port ${PORT}`);
});
