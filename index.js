require("dotenv").config();
const express = require("express");
const router = require("./routes/auth_router");
const routerVk = require("./routes/vk_router");
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./middleware/error-middleware");
const cors = require("cors");
const PORT = process.env.PORT || 5001;

const app = express();
app.use(
  cors({
    credentials: true,
    origin: process.env.URL_CLIENT,
  })
);

app.use(express.json());
app.use(cookieParser("querty"));
app.use("/api", router);
app.use("/apiVk", routerVk);
app.use(errorMiddleware);
const start = () => {
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
};

start();
