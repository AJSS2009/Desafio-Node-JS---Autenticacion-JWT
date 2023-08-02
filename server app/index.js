const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT;

const router = require("./routes/routes.user");

app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: "GET, POST, PUT, DELETE",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.get("/holaMundo", (req, res) => {
  res.send("holaMundo");
});

app.use("/user", router);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "ERROR EN EL SERVIDOR";
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(status).send(message);
});

app.listen(port, () => {
  console.log(`PUERTO DEL SERVIDOR: ${port}`);
});
