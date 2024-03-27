// @ts-check
const os = require('os');
const http = require('http');
const https = require('https');
const express = require('express');
const cors = require('cors');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
require('dotenv').config();
const path = require('path');
const fs = require('fs');

const StockAgent = require('./route/stockAgent');
const swagger = require('./swagger');
const traderRoutes = require('./route/trader');
const accountMAdapter = new FileSync('./db/accountM.json');
const accountM = low(accountMAdapter);
const accountDAdapter = new FileSync('./db/accountD.json');
const accountD = low(accountDAdapter);

accountM.defaults({ ACCOUNTS: [ { ACCOUNT: '', PWD: '' } ] })
accountD.defaults({ 123: [ { action: '', amoung: '' } ] })

const config = process.env;

// const certPath = path.join(__dirname, 'cert', config.CERT);
// const keyPath = path.join(__dirname, 'cert', config.CERT_KEY);
// const certOption = {
//     cert: fs.readFileSync(certPath),
//     key: fs.readFileSync(keyPath),
//     passphrase: config.CERT_PWD
// }

const app = express();
const server = http.createServer(app);
// const server = https.createServer(certOption, app);
app.use(cors());
app.use(express.json());
app.accountM = accountM;
app.accountD = accountD;

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
            console.log(`Server host on ${iface.address}:${config.PORT}`);
        });
    });
});

