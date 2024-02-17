console.log(`import trader.js`);
const express = require('express');
const router = express.Router();

// const db = require('../db/dbSetting');

/**
 * @swagger
 * components:
 *  schemas:
 *    Response:
 *      type: object
 *      required:
 *        - RETCODE
 *      properties:
 *        RETCODE:
 *          type: string
 *          description: Response's Statue
 *        RESULT:
 *          type: string
 *          description: Response's Result
 *        MSG:
 *          type: string
 *          description: Response MSG
 *      example:
 *        RETCODE: OK
 *        RESULT: OK
 *        MSG: 123
 *    LoginRequest:
 *      type: object
 *      required:
 *        - ACCOUNT
 *        - PWD
 *      properties:
 *        ACCOUNT:
 *          type: string
 *          description: Account
 *        PWD:
 *          type: string
 *          description: Password
 *      example:
 *        ACCOUNT: SAKUARD
 *        PWD: pwd@111111
 *    AccountAction:
 *      type: object
 *      required:
 *        - ACCOUNT
 *        - ACTION
 *        - AMOUNG
 *      properties:
 *        ACCOUNT:
 *          type: string
 *          description: Account
 *        ACTION:
 *          type: string
 *          description: Account
 *        AMOUNG:
 *          type: string
 *          description: Password
 *      example:
 *        ACCOUNT: SAKUARD
 *        ACTION: in
 *        AMOUNG: 2066
 */

/**
 * @swagger
 * tags:
 *  name: Trader
 *  description: The trader managing API
 */

/**
 * @swagger
 * /trader/user/{account}:
 *  get:
 *   summary: Returns the login status of the trader
 *   tags: [Trader]
 *   parameters:
 *      - in: path
 *        name: account
 *        schema:
 *          type: string
 *        required: true
 *        description: The ACCOUNT name
 *   responses:
 *    200:
 *     description: The login status of the trader
 *     content:
 *      application/json:
 *        schema:
 *         $ref: '#/components/schemas/Response'
 */
router.get('/user/:account', (req, res) => {
  console.log(`param: ${JSON.stringify(req.params)}`)
  let response = {
    RETCODE: 'OK',
    MSG: 'trader login'
  }
  res.send(response);
})

/**
 * @swagger
 * /trader/user/login:
 *  post:
 *    summary: Returns the login status of the trader
 *    tags: [Trader]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/LoginRequest'
 *    responses:
 *      200:
 *        description: The login status of the trader
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Response'
 *      400:
 *        description: Error on Account or Password
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Response'
 */
router.post('/user/login', (req, res) => {
  // console.log(`req: `, req.body);
  let result = req.app.ACCOUNTS.get('ACCOUNTS').find({ACCOUNT: req.body.ACCOUNT, PWD: req.body.PWD}).value();
  console.log(`result: `, result);
  let response = {}
  if (result) {
    response = {
      RETCODE: 'OK',
      MSG: 'trader login'
    }
  }
  else {
    response = {
      RETCODE: 'NG',
      MSG: 'Wrong Account or Password'
    }
  }
  res.send(response);
})

/**
 * @swagger
 * /trader/account/action:
 *  put:
 *    summary: Log Account Act
 *    tags: [Trader]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/AccountAction'
 *    responses:
 *      200:
 *        description: The result of Account Logs
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Response'
 *      400:
 *        description: Error on Account Logs
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Response'
 */
router.put('/account/action', (req, res) => {
  console.log(`req: `, req.body);
  let ACCOUNT = req.body.ACCOUNT;
  let ACTION = {
    action: req.body.ACTION,
    amoung: req.body.AMOUNG
  }
  console.log(`ACTION: `,ACTION)
  // console.log(req.app.accountD.get('ACCOUNTS').value())
  console.log(req.app.accountD.get('ACCOUNTS').get(ACCOUNT).value())
  req.app.accountD.get('ACCOUNT').get(ACCOUNT).push(ACTION).write();
  let response;
  response = {
    RETCODE: 'OK',
    MSG: 'OK'
  }
  res.send(response);
})

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
// async function sqlQueryTest() {
// console.log(`sqlQueryTest() called`);
//   await sleep(1000);
//   try {
//     await db.dbConnection;
//     let _sql = `SELECT * FROM ACCOUNTS`
//     let result = await db.dbconnect.request().query(_sql);
//     console.log(`result: `, result.recordset);
//   } catch (err) {
//     console.log(`Error: `, err)
//   }
// }
// sqlQueryTest();

module.exports = router;