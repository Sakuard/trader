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
 */


/**
 * @swagger
 * tags:
 *  name: Trader
 *  description: The trader managing API
 */

/**
 * @swagger
 * /trader/login:
 *  get:
 *   summary: Returns the login status of the trader
 *   tags: [Trader]
 *   responses:
 *    200:
 *     description: The login status of the trader
 *     content:
 *      application/json:
 *        schema:
 *         $ref: '#/components/schemas/Response'
 */
router.get('/login', (req, res) => {
  console.log(`request: /trader/login`);
  let response = {
    RETCODE: 'OK',
    MSG: 'trader login'
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