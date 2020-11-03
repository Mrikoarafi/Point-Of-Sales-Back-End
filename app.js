const express = require("express");
const bodyParser = require("body-parser");
const produkRouter = require("./src/routes/v1/produk");
const produkCategory = require("./src/routes/v1/category");
const produkHistory = require("./src/routes/v1/history")
const usersRouter = require("./src/routes/v1/users")
const transaksiRouter = require("./src/routes/v1/transaksi")
const cors = require("cors");
// const static = require('express')

const {
  PORT
} = require("./src/helpers/env");
const app = express();
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
const path = require('path')
app.set('views', path.join(__dirname, 'src/views'))
app.set('view engine', 'ejs')
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('src/uploads'))
app.use("/api/v1/produk", produkRouter);
app.use("/api/v1/category", produkCategory);
app.use("/api/v1/history", produkHistory)
app.use("/api/v1/users", usersRouter)
app.use("/api/v1/transaksi", transaksiRouter)

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});