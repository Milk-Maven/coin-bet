import express from 'express';
import bodyParser from 'body-parser';
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

var port = 3000;

app.post('/sample/put/data', function(req, res) {
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
