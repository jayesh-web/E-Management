const nodemailer = require("nodemailer");
const path = require("path");

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false,
//   auth: {
//     // user: "jayesh.s@codiste.com",
//     // pass: "olge nkcm mrik vobi",
//     user: process.env.APP_USER,
//     pass: process.env.APP_PASSWORD,
//   },
// });

const mailOptions = {
  from: { name: "Jayesh Kumar", address: "jayesh.s@codiste.com" }, // sender address
  to: ["kalpesh.g@codiste.com"], // list of receivers
  subject: "send mail using nodemailer and gmail ✔", // Subject line
  text: "Welcome to the codiste", // plain text body
  html: "<b>Hello world?</b>", // html body
  attachments: [
    {
      filename: "test.pdf",
      path: path.join(__dirname, "sample.pdf"),
      contentType: "application/pdf",
    },
  ],
};

// const sendEmail = async (transporter, mailOptions) => {
//   try {
//     await transporter.sendMail(mailOptions);
//     console.log("email send successfully");
//   } catch (err) {
//     console.log(err);
//   }
// };

// sendEmail(transporter, mailOptions);

class EmailService {
  // static transporter = async()=>{
  //    return

  // }
  //   static transporter = nodemailer.createTransport({
  //     service: "gmail",
  //     host: "smtp.gmail.com",
  //     port: 587,
  //     secure: false,
  //     auth: {
  //       user: process.env.APP_USER,
  //       pass: process.env.APP_PASSWORD,
  //     },
  //   });

  static transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.APP_USER,
      pass: process.env.APP_PASSWORD,
    },
  });
  static sendEmail = async (mailOptions) => {
    console.log(
      "env",
      process.env.APP_USER === "jayesh.suthar07@gmail.com",
      process.env.APP_PASSWORD === "olge nkcm mrik vobi"
    );

    try {
      const user = process.env.APP_USER;
      const pass = process.env.APP_PASSWORD;
      const Transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          // user: "jayesh.s@codiste.com",
          // pass: "olge nkcm mrik vobi",
          user: user,
          pass: pass,
        },
      });
      await Transporter.sendMail(mailOptions);
      console.log("email sent successfully");
    } catch (err) {
      throw err;
    }
  };
}
module.exports = EmailService;
