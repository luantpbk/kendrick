const express = require('express');
const app = express();

app.delete('/file/image/-1', (req, res) => {
  const fileId = Number(req.params.id);
  res.json({ route: '-1', id: req.params.id, isNaN: isNaN(fileId) });
});

app.delete('/file/image/:id', (req, res) => {
  const fileId = Number(req.params.id);
  res.json({ route: ':id', id: req.params.id, isNaN: isNaN(fileId) });
});

const server = app.listen(0, () => {
  const port = server.address().port;
  const http = require('http');
  http.request({
    method: 'DELETE',
    port: port,
    path: '/file/image/-1'
  }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log(`Status: ${res.statusCode}`);
      console.log(`Body: ${data}`);
      server.close();
      process.exit(0);
    });
  }).end();
});
