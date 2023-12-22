import express from "express";
import logger from "morgan";
import cors from "cors";
import mongoose from "mongoose";

import contactsRouter from "./routes/api/contacts.js";

const DB_HOST =
  "mongodb+srv://Elena_Krapivnaya:HzgTLCx%40EUx.9X_@atlascluster.yl2exwb.mongodb.net/?retryWrites=true&w=majority";
mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(3000, console.log("Server running on 3000 PORT"));
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

app.use("/api/contacts", contactsRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

export default app;
