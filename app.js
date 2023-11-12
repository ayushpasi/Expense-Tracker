const express = require("express");
const bodyParser = require("body-parser");

const userRouter = require("./routes/userRouter");
const sequelize = require("./util/database");
const expenseRouter = require("./routes/expenseRouter");

const cors = require("cors");
const app = express();
app.use(express.static("public"));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/", userRouter);
app.use("/user", userRouter);
app.use("/expense", expenseRouter);
sequelize
  .sync()
  .then(() => {
    app.listen(3000, () => {
      console.log("http://localhost:3000");
    });
  })
  .catch((err) => {
    console.error(err);
  });
