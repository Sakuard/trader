console.log(`import trader.js`);
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// const db = require('../db/dbSetting');
function jwtAuth(req, res, next) {
  console.log(`exec jwtAuth() ...`)
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  })
}


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
 *    AccountsData:
 *      type: object
 *      required:
 *        - RETCODE
 *      properties:
 *        RETCODE:
 *          type: string
 *          description: Response's Statue
 *        RESULT:
 *          type: array
 *          items:
 *            type: string
 *          description: Response's Result
 *      example:
 *        RETCODE: OK
 *        RESULT: ["SAKUARD","EDWARD","LAI"]
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
 *  securitySchemes:
 *    BearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 *  security:
 *    - BearerAuth: []
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
  console.log(`exec :account`)
  console.log(`param: ${JSON.stringify(req.params)}`)
  let response = {
    RETCODE: 'OK',
    MSG: 'trader login'
  }
  res.send(response);
})

/**
 * @swagger
 * /trader/accounts/data:
 *  get:
 *   summary: Returns the login status of the trader
 *   tags: [Trader]
 *   responses:
 *    200:
 *     description: The login status of the trader
 *     content:
 *      application/json:
 *        schema:
 *         $ref: '#/components/schemas/AccountsData'
 */
router.get('/accounts/data', (req, res) => {
  const accountList = Object.keys(req.app.accountD.get('ACCOUNT').value())
  // console.log(`result: `, accountList);
  let response = {
    RETCODE: 'OK',
    RESULT: accountList
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
 *              RETCODE:
 *                type: string
 *              TOKEN:
 *                type: string
 *              MSG:
 *                type: string
 *            example:
 *              RETCODE: OK
 *              TOKEN: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBQ0NPVU5UIjoiU0FLVUFSRCIsIlVTRVJOQU1FIjoiU2FrdWFyZCIsIlBXRCI6InB3ZEAxMTExMTEiLCJDRVJBVEVUSU1FIjoiMjAyNC0wMS0zMFQyMTozMjo1MC40MzBaIiwiQ1JFQVRFVVNFUiI6IlNha3VhcmQiLCJVUERBVEVUSU1FIjpudWxsLCJVUERBVEVVU0VSIjpudWxsLCJFTkFCTEVEIjoiWSIsImlhdCI6MTcwODE3ODIyOSwiZXhwIjoxNzA4MTc4MjQ0fQ.Hzwtv_wHSOGxjtMqVRXj-aRqMOTIkiv1DMASgd3kpQk
 *              MSG: trader login
 *      400:
 *        description: Error on Account or Password
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Response'
 */
router.post('/user/login', (req, res) => {
  // console.log(`req: `, req.body);
  let result = req.app.accountM.get('ACCOUNTS').find({ACCOUNT: req.body.ACCOUNT, PWD: req.body.PWD}).value();
  console.log(`result: `, result);
  let response = {}
  if (result) {
    const token = jwt.sign(result, process.env.JWT_KEY, {expiresIn: '60s'});

    console.log(`token: `, token);
    response = {
      RETCODE: 'OK',
      TOKEN: token,
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
    ACTION: req.body.ACTION,
    AMOUNG: req.body.AMOUNG
  }
  req.app.accountD.get('ACCOUNT').get(ACCOUNT).push(ACTION).write();
  let response;
  response = {
    RETCODE: 'OK',
    MSG: 'OK'
  }
  res.send(response);
})

/**
 * @swagger
 * /trader/protected:
 *  get:
 *    summary: Access a protected route
 *    tags: [Trader]
 *    security:
 *      - BearerAuth: []
 *    responses:
 *      200:
 *        description: Success message
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Response'
 *      401:
 *        description: Unauthorized, missing or invalid JWT
 */
router.get('/protected', jwtAuth, (req, res) => {
  console.log(`exec /protected: `, req)
  res.send({ RETCODE: 'OK', MSG: 'Success!' });
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