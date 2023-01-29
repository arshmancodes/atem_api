const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');



router.post('/updateSecret', authController.updateSecret);
/**
 * @swagger
 * /auth/postData:
 *  post: 
 *      summary: This API is used to Post the Authorization data to the server
 *      description: The Authorization is performed by using this API.
 *      responses:
 *          200:
 *              description: Successfully Authorized
 */
router.post('/postData', authController.postAuth);
/**
 * @swagger
 * /auth/getAll:
 *  get: 
 *      summary: This API is used to get all the Registered User's on Noozle
 *      description: The API returns the data of all the user's registered
 *      responses:
 *          200:
 *              description: Successfully Authorized
 */
router.get('/getAll', authController.getAuth);
/**
 * @swagger
 * /auth/login:
 *  post: 
 *      summary: This API is used to login the user to the Noozle Application.
 *      description: The Authorization is performed by using this API.
 *      responses:
 *          200:
 *              description: Successfully Authorized
 */
router.post('/login', authController.login);
/**
 * @swagger
 * /auth/verifyOTP:
 *  post: 
 *      summary: This API is used to verify the OTP sent to the user
 *      description: The OTP verification is processed by this API
 *      responses:
 *          200:
 *              description: Successfully Authorized
 */
router.post('/verifyOTP', authController.verifyOTP);
/**
 * @swagger
 * /auth/resendOTP:
 *  post: 
 *      summary: This API is used to resend the OTP.
 *      description: The server resends the OTP to the registered email in case the user doesn't recieve it.
 *      responses:
 *          200:
 *              description: Successfully Authorized
 */
router.post('/resendOTP', authController.forgotPass);
/**
 * @swagger
 * /auth/updatePass:
 *  post: 
 *      summary: This API is used to update the password of the user.
 *      description: The password update procedure is done by this API.
 *      responses:
 *          200:
 *              description: Successfully Authorized
 */
router.post('/updatePass', authController.updatePass);
/**
 * @swagger
 * /auth/getUserByEmail:
 *  post: 
 *      summary: This API is used to get the User by Email address to check if a specific email is registered or not
 *      description: The Email check is performed by this API.
 *      responses:
 *          200:
 *              description: Successfully Authorized
 */
router.post('/getUserByEmail', authController.getUserByEmail);
/**
 * @swagger
 * /auth/updateEmail:
 *  post: 
 *      summary: This API is used to update the email of the User.
 *      description: The Update Email API is used to update the user email stored in the database.
 *      responses:
 *          200:
 *              description: Successfully Authorized
 */
router.post('/updateEmail', authController.updateEmail);




module.exports = router;