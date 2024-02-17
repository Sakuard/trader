// @ts-check
const os = require('os');
const http = require('http');
const express = require('express');
const cors = require('cors');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const swagger = require('./swagger');
const traderRoutes = require('./route/trader');
const accountMAdapter = new FileSync('./db/accountM.json');
const accountM = low(accountMAdapter);
const accountDAdapter = new FileSync('./db/accountD.json');
const accountD = low(accountDAdapter);

accountM.defaults({ ACCOUNTS: [ { ACCOUNT: 'SAKUARD', PWD: 'pwd@111111' } ] })
accountD.defaults({ 123: [ { action: 'in', amoung: '2000' } ] })

const config = process.env;

const app = express();
const server = http.createServer(app);
app.use(cors());
app.use(express.json());
app.accountM = accountM;
app.accountD = accountD;

// function jwtAuth(req, res, next) {
//   console.log(`exec jwtAuth() ...`)
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];
//   if (token == null) return res.sendStatus(401);

//   jwt.verify(token, config.JWT_KEY, (err, user) => {
//     if (err) return res.sendStatus(403);
//     req.user = user;
//     next();
//   })
// }

app.get('/', (req, res) => { res.send('Hello world') })
app.use('/trader', traderRoutes);

swagger(app);

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

