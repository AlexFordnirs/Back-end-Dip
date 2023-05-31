const nodemailer = require("nodemailer");
const bcrypt = require('bcryptjs');
const fetch = require('node-fetch');
require('dotenv').config()
class MailController{
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            secure: false,
            auth: {
                user: "Grammarsone@gmail.com",
                pass: process.env.Pass,
            },
        });
    }
    async sendActivationMail(to, link) {
        await this.transporter.sendMail({
            from: "Grammarsone@gmail.com",
            to,
            subject: "Активация акаунта",
            text: "",
            html:
                `<div>
          <h1>Для активации перейдите по ссылке</h1>
          <a href="${link}">${link}</a>
          </div>
          `
        });
    }
    async initActivasion(user) {
        console.log(user.email);

        var salt = bcrypt.genSaltSync(16);
        var token = await bcrypt.hashSync(user.email, salt);
        await this.sendActivationMail(user.email, `http://localhost:3000/order/activate/${encodeURIComponent(token)}/${user.id}`);
        console.log('SendActivasion end');
    }
    IsMatch(email, token) {
        return bcrypt.compareSync(email, token);
    }
    async ConfirmEmail(req, res) {
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
    }
}

module.exports = new MailController