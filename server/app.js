// @ts-check
const os = require('os');
const http = require('http');
const express = require('express');
const cors = require('cors');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
require('dotenv').config();

const swagger = require('./swagger');
const traderRoutes = require('./route/trader');
const adapter = new FileSync('db.json');
const db = low(adapter);

db.defaults({ ACCOUNT: [{ ACCOUNT: 'SAKUARD', PWD: 'pwd@111111'}]})

const config = process.env;

const app = express();
const server = http.createServer(app);

app.get('/', (req, res) => { res.send('Hello world') })
app.use('/trader', traderRoutes);

swagger(app);
app.use(cors());
app.db = db;

server.listen(config.PORT, () => {
  const ifaces = os.networkInterfaces();

  Object.keys(ifaces).forEach(ifname => {
    ifaces[ifname].forEach(iface => {
      if ('IPv4' !== iface.family || iface.internal !== false) {
        // 跳過內部（i.e., 127.0.0.1）和非ipv4地址
        return;
      }
      console.log(`Server running on http://${iface.address}:${config.PORT}`);
    });
  });
});

