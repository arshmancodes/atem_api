const db = require('../utils/database');
const nodemailer = require('nodemailer');
const { genSaltSync, hashSync, compareSync } = require('bcrypt');
const bcrypt = require('bcrypt');


exports.postAuth = (req, res, next) => {

    var email_address = req.body.email_address;
    var password = req.body.password;
    
    var fcmToken = req.body.fcmToken;

    const salt = genSaltSync(10);
    password = hashSync(req.body.password, salt);
    const otp_salt = genSaltSync(10);

    db.execute("SELECT * FROM users where email =?", [email_address]).then(([rows, fieldData]) => {
        
        if(rows.length > 0)
        {
            res.status(200).json({
                success: false,
                message: "Email Already Exists",
            });
        }
        else
        {
            var otp = Math.floor(100000 + Math.random() * 900000);
            console.log(otp);
            //sendEmailOTP(otp, email_address);
            otp = otp.toString();
            
            otp = hashSync(otp, otp_salt);
            console.log(otp)
            db.execute('INSERT INTO users(email, password, user_phrase, fcmToken, isVerified, authenticator, secret) VALUES (?, ?, ?, ?, ?, ?)', [email_address, password, req.body.user_phrase, fcmToken, req.body.isVerified, req.body.authenticator, otp]).then(([rows, fieldData]) => {
                 
                res.status(200).json({
                    success: true,
                    data : rows,
                    
                })
            }).catch(err => {
                res.status(200).json({
                    success : false,
                    message: err,
                })
            })
        }
    })

    

}

exports.getAuth = (req, res, next) => {

    db.execute('SELECT * from users').then(([rows, fieldData]) => {
        res.status(200).json(rows);
    }).catch(err => {
        res.status(502).json({
            error: err,
            success: false,
        })
    })
}

exports.login = (req, res, next) => {

    var email_address = req.body.email_address;
    var password = req.body.password;


    db.execute('SELECT * FROM users WHERE email=?', [req.body.email_address]).then(([rows, fieldData]) => {
        if(rows.length > 0) 
        {
            const validPassword = compareSync(req.body.password, rows[0].password);
            if(validPassword)
            {
                res.status(200).json({
                    message : 'User logged in Successfully',
                    success: true,
                    data: rows[0],
                    
                })
            }
            else
            {
                res.status(200).json({
                    success: false,
                    message: "User Login failed!, Invalid Username or Password",
                })
            }
        }
        else
        {
            res.status(200).json({
                success: false,
                message: "User not Found"
            })
        }
    })
}


function sendEmailOTP(otp, email, res) {
    var transporter = nodemailer.createTransport({
        host: "smtp.hostnet.nl",
        port: 587,
        secure: true, // upgrade later with STARTTLS
        auth: {
          user: "noreply@noozle.nl",
          pass: "Noozle@123",
        },
      });

    transporter.verify(async function (error, success) {
        if (error) {
            
          console.log(error);
        } else {

           
           var htmlmsg = `<h3>Dear user the One Time Password (OTP) for the Noozle account is </h3> </br> <h2> ${otp} </h2>`
            let info = await transporter.sendMail({
                from: '"Noozle" <noreply@codeminer.co>', // sender address
                to: email, // list of receivers
                subject: "Noozle OTP", // Subject line
                text: "Dear user the One Time Password (OTP) for the Noozle account is ", // plain text body
                html: htmlmsg, // html body
              });

              console.log("Message sent: %s", info.messageId);
  
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            //res.status(200).send("Email Sent");
        }
      });
}



exports.forgotPass = (req, res, next) => {
    db.execute("SELECT * FROM users where email=?", [req.body.email_address]).then(([rows, fieldData]) => {
        if(rows.length > 0)
        {
            var otp = Math.floor(100000 + Math.random() * 900000);
            const otp_salt = genSaltSync(10);
            console.log(otp);
            otp = otp.toString();
            sendEmailOTP(otp, req.body.email_address);
            otp = hashSync(otp, otp_salt);
            
            db.execute("UPDATE users SET secret=? WHERE email=?", [otp, req.body.email_address]).then(([rows, fieldData]) => {
                res.status(200).json({
                    status: true,
                    message: "The OTP has been regenerated and sent to the email"
                })
            })
        }
        else
        {
            res.status(200).json({
                status: false,
                message: "The email address is not linked with any account"
            })
        }
    })
}


exports.updatePass = (req, res, next) => {

    const salt = genSaltSync(10);
    req.body.password = hashSync(req.body.password, salt);

    db.execute("UPDATE users SET password=? where email=?", [req.body.password, req.body.email_address]).then(([rows, fieldData]) => {
        res.status(200).json({
            status: true,
            message: "The Password has been Successfully Updated"
        })
    }).catch((err) => {
        res.status(200).json({
            success: false,
            error: err,
            message: "The password has not been updated"
        })
    })
}

exports.updateEmail = (req, res, next) => {

    db.execute("UPDATE users SET email=? where id=?", [req.body.email_address, req.body.id]).then(([rows, fieldData]) => {
        res.status(200).json({
            status: true,
            message: "The Email has been Successfully Updated"
        })
    }).catch((err) => {
        res.status(200).json({
            success: false,
            error: err,
            message: "The email has not been updated"
        })
    })
}



exports.verifyOTP = (req, res, next) => {

    db.execute("SELECT secret FROM users where email=?", [req.body.email_address]).then(([rows, fieldData]) => {
        
        var approved = compareSync(req.body.otp, rows[0].secret);
        var newSecret ="null";
        if(approved)
        {
            db.execute("UPDATE users SET isVerified=?, secret=? where email=?", [true,newSecret ,req.body.email_address]).then(([rows, fieldData]) => {
                res.status(200).json({
                    message: "Successfully Verified",
                    success: true
                })
            }).catch(err => {
                res.status(200).json({
                    message: "Failed",
                    success: false,
                })
            })
        }
        else
        {
            res.status(200).json({
                message: "OTP Invalid",
                success: false
            })
        }
    })
}


exports.getUserByEmail = (req, res, next) => {
    db.execute('SELECT * from users WHERE email=?', [req.body.email_address]).then(([rows, fieldData]) => {
        res.status(200).json({
            message: "User data has been fetched",
            data : rows,
            success : true,
        })
    }).catch((err) => {
        res.status(200).json({
            message: "The user data not found",
            success: false,
            error: err
        })
    })
}