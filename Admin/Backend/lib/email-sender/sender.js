const nodemailer = require("nodemailer");
const rateLimit = require("express-rate-limit");
const { sendJson } = require("../../guider/sendResponse");
const Setting = require("../../models/Setting")

const sendEmail = (body, res, message) => {
  const transporter = nodemailer.createTransport({
    host: global.HOST,
    service: global.SERVICE, //comment this line if you use custom server/domain
    port: global.EMAIL_PORT,
    secure: true,
    auth: {
      user: global.EMAIL_USER,
      pass: global.EMAIL_PASS,
    },

    //comment out this one if you usi custom server/domain
    // tls: {
    //   rejectUnauthorized: false,
    // },
  });

  // transporter.verify(function (err, success) {
  //   if (err) {
  //     res.status(403).send({
  //       message: `Error happen when verify ${err.message}`,
  //     });
  //   } else {
  //   }
  // });

  transporter.sendMail(body, (err, data) => {
    if (err) {
      // res.status(403).send({
      //   message: `Error happen when sending email ${err.message}`,
      // });
      let returnValue = {status:false,message:"Something went to wrong, Please try again later!", text:`${err.message}`};
      sendJson.sendJson(returnValue,res);
    } else {
      // res.send({
      //   message: message,
      // });
      sendJson.sendJson(message,res);
    }
  });
};

const sendemail = async (option, res, message) => {
  let settingData = await Setting.findOne({},{setting : 1 , _id: 0})
  let html = option.html.replace('###logo###',settingData.setting.logo)
                        .replace('###Address###',settingData.setting.address)
                        .replace('###contactNumber###',settingData.setting.contact)
                        .replace('###Email###',settingData.setting.email)
                        .replace('###website###',settingData.setting.website)
                        .replace('###facebook###',"https://ecommercereact.s3.us-west-2.amazonaws.com/templeteImage/fbbb.png").replace('FBlink',settingData.setting.FBlink)
                        .replace('###instagram###',"https://ecommercereact.s3.us-west-2.amazonaws.com/templeteImage/insta.png").replace('instaLink',settingData.setting.instaLink)
                        .replace('###twitter###',"https://ecommercereact.s3.us-west-2.amazonaws.com/templeteImage/twitter.png").replace('twitterLink',settingData.setting.twitterLink)
                        .replace('###telegram###',"https://ecommercereact.s3.us-west-2.amazonaws.com/templeteImage/tele.png").replace('telegramLink',settingData.setting.telegramLink)

  const body = {
    from: process.env.EMAIL_USER,
    to: `${option.toemail}`,
    subject: option.subject,
    html:html,
  };
  const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    service: process.env.SERVICE, //comment this line if you use custom server/domain
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },

    //comment out this one if you usi custom server/domain
    // tls: {
    //   rejectUnauthorized: false,
    // },
  });

  transporter.verify(async function (err, success) {
    if (err) {
      let payload = {status:false , message:`Error happen when verify ${err.message}`}
      await sendJson(payload,res)
    } else {
  }
  });

  transporter.sendMail(body, async (err, data) => {
    if (err) {
      let payload = {status:false , message:`Error happen when sending email ${err.message}`}
      await sendJson(payload,res)
    } else {
      await sendJson(message,res)
    }
  });
};
//limit email verification and forget password
const minutes = 30;
const emailVerificationLimit = rateLimit({
  windowMs: minutes * 60 * 1000,
  max: 3,
  handler: (req, res) => {
    res.status(429).send({
      success: false,
      message: `You made too many requests. Please try again after ${minutes} minutes.`,
    });
  },
});

const passwordVerificationLimit = rateLimit({
  windowMs: minutes * 60 * 1000,
  max: 3,
  handler: (req, res) => {
    res.status(429).send({
      success: false,
      message: `You made too many requests. Please try again after ${minutes} minutes.`,
    });
  },
});

const supportMessageLimit = rateLimit({
  windowMs: minutes * 60 * 1000,
  max: 5,
  handler: (req, res) => {
    res.status(429).send({
      success: false,
      message: `You made too many requests. Please try again after ${minutes} minutes.`,
    });
  },
});

module.exports = {
  sendEmail,sendemail,
  emailVerificationLimit,
  passwordVerificationLimit,
  supportMessageLimit,
};
