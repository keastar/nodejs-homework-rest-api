import express from "express";
import logger from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import authRouter from "./routes/api/authorization.js";
import contactsRouter from "./routes/api/contacts.js";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcrypt";

//ищет в корне файл проекта .env и читает его по рядкам
//и добавляет глобальные объекты process.env в процессе запуска проекта
import "dotenv/config";

// import authRouter from "./routes/api/authorization.js";

const { DB_HOST, PORT = 3000 } = process.env;

// const payload = {
//   id: "658e929e6604bce87307baf1",
// };
// const token = jwt.sign(payload, SECRET_KEY);
// console.log(token);

// const decode = jwt.decode(token);
// console.log(decode);

// try {
//   const { id } = jwt.verify(token, SECRET_KEY, { expiresIn: "24h" });
//   console.log(id);
//   const invalidToken =
//     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1OGU5MjllNjYwNGJjZTg3MzA3YmFmMSIsImlhdCI6MTcwNDI5ODIwMn0.ebevdwoVQ7gCAgkiEl79N3qtwlG-f_NQ0djrMot_mUS";
//   const result = jwt.verify(invalidToken, SECRET_KEY);
// } catch (error) {
//   console.log(error.message);
// }

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

// const createHashPassword = async (password) => {
//   const result = await bcrypt.hash(password, 10);
//   // console.log(result);
//   const compareResult = await bcrypt.compare(password, result);
// };

// createHashPassword("123456");

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/contacts", contactsRouter);
// app.use("/api/users", usersRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

export default app;
