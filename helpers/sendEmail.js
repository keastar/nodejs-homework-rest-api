import ElasticEmail from "@elasticemail/elasticemail-client";
import nodemailer from "nodemailer";
import "dotenv/config";

const {
  //   ELASTIC_API_KEY,
  //   ELASTIC_EMAIL_FROM,
  META_PASSWORD,
  META_MAIL_FROM,
} = process.env;

const nodemailerConfig = {
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: {
    user: META_MAIL_FROM,
    pass: META_PASSWORD,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

/*
const data = {
  from: META_EMAIL,
  to: "cedilo8106@tsderp.com",
  subject: "Test email",
  html: "<strong> Test email </strong>",
};
*/

const sendEmail = (data) => {
  const email = { ...data, from: META_MAIL_FROM };
  return transport.sendMail(email);
};

export default sendEmail;

// const defaultClient = ElasticEmail.ApiClient.instance;

// const { apikey } = defaultClient.authentications;
// apikey.apiKey = ELASTIC_API_KEY;

// const api = new ElasticEmail.EmailsApi();

// const email = ElasticEmail.EmailMessageData.constructFromObject({
//   Recipients: [new ElasticEmail.EmailRecipient("cedilo8106@tsderp.com")],
//   Content: {
//     Body: [
//       ElasticEmail.BodyPart.constructFromObject({
//         ContentType: "HTML",
//         Content: "<p><strong>Test email</strong> from localhost:3000</p>",
//       }),
//     ],
//     Subject: "Test email",
//     From: ELASTIC_EMAIL_FROM,
//   },
// });

// transport
//   .sendMail(email)
//   .then(() => console.log("Email send success"))
// .catch((error) => console.log(error.message));

// const callback = function (error, data, response) {
//   if (error) {
//     console.error(error);
//   } else {
//     console.log("API called successfully.");
//   }
// };
// api.emailsPost(email, callback);
