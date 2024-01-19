import express from "express";
import logger from "morgan";
import cors from "cors";
// import nodemailer from "nodemailer";
import "dotenv/config";
import mongoose from "mongoose";
import authRouter from "./routes/api/authorization.js";
import contactsRouter from "./routes/api/contacts.js";
// import ElasticEmail from "@elasticemail/elasticemail-client";

//ищет в корне файл проекта .env и читает его по рядкам
//и добавляет глобальные объекты process.env в процессе запуска проекта
import "dotenv/config";

const { DB_HOST, PORT = 3000 } = process.env;

// const {
//   ELASTIC_API_KEY,
//   ELASTIC_EMAIL_FROM,
//   META_PASSWORD,
//   META_EMAIL,
// } = process.env;

// const nodemailerConfig = {
//   host: "smtp.meta.ua",
//   port: 465,
//   secure: true,
//   auth: {
//     user: META_EMAIL,
//     pass: META_PASSWORD,
//   },
// };

// const transport = nodemailer.createTransport(nodemailerConfig);

// const email = {
//   from: META_EMAIL,
//   to: "cedilo8106@tsderp.com",
//   subject: "Test email",
//   html: "<strong> Test email </strong>",
// };

// transport
//   .sendMail(email)
//   .then(() => console.log("Email send success"))
//   .catch((error) => console.log(error.message));

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

// const callback = function (error, data, response) {
//   if (error) {
//     console.error(error);
//   } else {
//     console.log("API called successfully.");
//   }
// };
// api.emailsPost(email, callback);

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(PORT, console.log(`Server running on ${PORT} PORT`));
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
//настройка Express на раздачу статических файлов из папки public
app.use(express.static("public"));

app.use("/api/joins", authRouter);
app.use("/api/contacts", contactsRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

export default app;
