export const handleSaveError = (error, data, next) => {
  const { name, code } = error;
  console.log(name);
  console.log(code);
  const status = name === "MongoServerError" && code === 11000 ? 409 : 400;
  error.status = status;
  next();
};

export const additingUpdateSettings = function (next) {
  this.options.new = true;
  this.options.runValidators = true;
  next();
};
