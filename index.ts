import express from 'express';
import bodyParser from 'body-parser';
//tengu app name
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

var port = 3000;

app.post('/bet/new', function(req, res) {
  console.log('receiving data ...');
  console.log('body is ', req.body);
  res.send(req.body);
});
app.get('/hello', (req, res) => {
  console.log('asdf')
})

// start the server
app.listen(port, () => {
  console.log(port, 'hello')
});

// make a bet
