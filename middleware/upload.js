import multer from "multer";
import path from "path";
import { HttpError } from "../helpers/index.js";

const destination = path.resolve("temp");

const storage = multer.diskStorage({
  destination,
  filename: (req, file, cb) => {
    const uniquePreffix = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniquePreffix}_${file.originalname}`;
    //если ошибок не случилось - то возвращает null(значит нет ошибок), то сохраняет файл с именем originalname;
    cb(null, filename);
  },
});

const limits = {
  fileSize: 1024 * 1024 * 5,
};

const fileFilter = (req, file, cb) => {
  const extention = req.originalname.split(".").pop();
  if (extention === "exe") {
    cb(HttpError(400, ".exe not valid extention"));
  }
};

const upload = multer({
  storage,
  limits,
  //   fileFilter,
});

export default upload;
