require('dotenv').config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const usersRouter = require("./routes/users");
const productsRouter = require("./routes/products");
const ordersRouter = require("./routes/orders");
const authRouter = require("./routes/auth");
const paymentRouter = require("./routes/payments");


app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("Povezan sa bazom."))
.catch(() => console.log("Nije povezan sa bazom."));

app.get("/", (req, res) => {
    res.send("Pocetna stranica. ");
})

app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/orders", ordersRouter);
app.use("/auth", authRouter);
app.use("/payments", paymentRouter);







app.listen(3000);