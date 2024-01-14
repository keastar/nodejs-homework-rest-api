import express from "express";
import logger from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import authRouter from "./routes/api/authorization.js";
import contactsRouter from "./routes/api/contacts.js";

//ищет в корне файл проекта .env и читает его по рядкам
//и добавляет глобальные объекты process.env в процессе запуска проекта
import "dotenv/config";

const { DB_HOST, PORT = 3000 } = process.env;

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
