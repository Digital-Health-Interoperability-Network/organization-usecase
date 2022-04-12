const pug = require('pug');
const nodemailer = require('nodemailer');

module.exports = class Email {
  constructor(email) {
    this.to = email;
    // this.url = url;
    this.from = process.env.EMAIL_USERNAME;
  }

  async send(template, subject, otp = '', url = '') {
    //1) render html based template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      subject,
      otp,
      url,
    });

    const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USERNAME, // generated ethereal user
        pass: process.env.EMAIL_PASSWORD, // generated ethereal password
      },
    });

    //3) createe a transport and send email
    const info = await transport.sendMail({
      from: 'Cura Healthcare Interoperabilty <uzoagulujoshua@gmail.com>', // sender address
      to: this.to, // list of receivers
      subject, // Subject line
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }

  //Welcome email
  async sendWelcome(url) {
    await this.send(
      'welcome',
      'Welcome to Cura Healthcare Interoperabilty',
      url
    );
  }

  //email verification
  async otpVerification(otp) {
    await this.send('otpVerification', 'Cura Registration', otp);
  }

  //Reset password Email
  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token. Valid for only 10 mins'
    );
  }
};
