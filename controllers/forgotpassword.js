const User = require("../models/user");
const ForgotPassword = require("../models/forgotpassword");

const uuid = require('uuid');
const bcrypt = require('bcrypt');

const Sib = require('@getbrevo/brevo');

require('dotenv').config();

const apiInstance = new Sib.TransactionalEmailsApi();
apiInstance.authentications['apiKey'].apiKey = process.env.SENDINBLUE_API_KEY;

exports.forgotPassword = (req, res, next) => {
    const email = req.body.email;

    User.findOne({ where: { email: email } })
    .then(user => {
        if (!user) {
            return res.status(404).json({ message: 'User does not exist' });
        } else {
            const id = uuid.v4();
            ForgotPassword.create({ id: id, userId: user.id, isactive: true })
            .then(() => {
                const sender = {
                    email: 'parrichaya.ecec@gmail.com'
                }

                const receivers = [{ email }]

                apiInstance.sendTransacEmail({
                    sender,
                    to: receivers,
                    subject: 'Password Reset link',
                    htmlContent: `<a href="http://13.236.146.218:6000/password/resetpassword/${id}">Click here to reset your password</a>`,
                })
                .then(() => {
                    console.log('Email sent successfully');
                    res.status(200).json({ message: 'Email sent!' });
                })
                .catch((error) => {
                    console.error(error);
                    res.status(500).json({ message: 'Error sending email' });
                })
            })
            .catch(error => {
                console.error(error);
                res.status(500).json({ message: 'Error creating forgotpassword' });
            })
        }
    })
    .catch(error => {
        console.error(error);
        res.status(500).json({ message: 'Error finding user' });
    })
}

exports.resetPassword = (req, res, next) => {
    const id = req.params.id;
    ForgotPassword.findOne({ where: { id: id , isactive: true} })
    .then(forgotpasswordrequest => {
        if (!forgotpasswordrequest) {
            return res.status(404).json({ message: 'Request not found' });
        } else {
            forgotpasswordrequest.update({ isactive: false })
            res.status(200).send(`
                <html>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
                <style>        
                    .form-group1 {
                        margin-top: 20px; 
                        max-width: 300px; 
                        margin-left: auto;
                        margin-right: auto;
                    }
                </style>
                    <body>
                        <div class="container-fluid">
                        <nav class="navbar navbar-dark bg-dark">
                            <span class="navbar-brand h1 d-flex justify-content-center w-100">Reset Password</span>
                        </nav><br>
                        <div class="row justify-content-center">
                            <div class="col-md-4">
                              <form action="/password/updatepassword/${id}" method="GET">
                                <div class="form-group1 mb-1">
                                <label for="password">Enter new password:</label>
                                  <input type="password" name="newpassword" class="form-control" required/>
                                </div>
                                 <div class="d-flex justify-content-center">
                                  <button type="submit" class="btn btn-primary">Reset Password</button>
                                </div>
                              </form>
                             </div>
                        </div>
                      </div>
                    </body>
                    <script> 
                    function formSubmitHandler(event) {
                        event.preventDefault();
                        console.log('api called');
                    }
                </script>
                </html>
                `)
            res.end();
        }
    })
    .catch(error => {
        console.error(error);
        res.status(500).json({ message: 'Error processing request' });
    })
}

exports.updatePassword = (req, res, next) => {
    const newpassword = req.query.newpassword;
    const resetId = req.params.id;

    ForgotPassword.findOne({ where : { id: resetId }}).then(resetpasswordrequest => {
        User.findOne({where: { id : resetpasswordrequest.userId}}).then(user => {
            if(user) {                
                console.log(newpassword, resetId);
                bcrypt.hash(newpassword, 10, (err, hash) => {
                    if(err){
                        return res.status(500).json({
                            error: err
                        });
                    }
                    user.update({ password: hash }).then(() => {
                        res.status(201).send('<h3>Password updated!</h3>');
                    })
                })                
        } else {
            return res.status(404).json({ error: 'No user Exists'})
        }
        })
    })
}

