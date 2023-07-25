// libs imports
import mongoose from "mongoose";
// local imports
import app from "./app.js";

const { DB_HOST } = process.env;

mongoose
  .connect(DB_HOST)
  .then(
    app.listen(3000, () => {
      console.log("Database connection successful");
    })
  )
  .catch((error) => {
    console.log(er);
    process.exit(1);
  });
