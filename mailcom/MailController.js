const nodemailer = require("nodemailer");
const bcrypt = require('bcryptjs');
const fetch = import('node-fetch');
require('dotenv').config()
class MailController{
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: "smtp.office365.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.USER,
                pass: process.env.PASS,
            },
        });
    }
    async sendActivationMail(to) {
        await this.transporter.sendMail({
            from: process.env.USER,
            to,
            subject: "Активация акаунта",
            text: "Привет вы успешно зарегестрирывали на Grammarzone!",
        },function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email отправлен: ' + info.response);
            }
        }

        );
    }
    async initActivasion(user) {
        console.log(user.email);
        await this.sendActivationMail(user.email);
        console.log('SendActivasion end');
    }
 /*   IsMatch(email, token) {
        return bcrypt.compareSync(email, token);
    }*/
    /*async ConfirmEmail(req, res) {
        const token = req.params.token;
        const id = req.params.id;
        console.log(token);
        console.log(id);
        var user = await (await fetch(`${process.env.URL}/User/${id}`)).json()
        console.log(user);
        if (this.IsMatch(user.email, token)) {
            console.log('confirmed')
            try {
                await fetch(`${process.env.URL}/User/${user.id}?confirmed=true`,{
                    method:"PATCH"
                })
            }
            catch {
                return res.status(400);
            }
            return res.status(200).send('Email confirmed.');
        }
        console.log('un confirmed')
        return res.status(400).send('Invalid email or token.');
    }*/
}

module.exports = new MailController;