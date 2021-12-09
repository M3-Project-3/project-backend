require("dotenv/config");
require("./db");
const express = require("express");

const { isAuthenticated } = require("./middleware/jwt.middleware");


const app = express();
require("./config")(app);


// 👇 Start handling routes here
const allRoutes = require("./routes");
app.use("/api", allRoutes);

const businessRouter = require("./routes/business.routes");
app.use("/business", businessRouter);

const authRouter = require("./routes/auth.routes");
app.use("/auth", authRouter);

const userRouter = require("./routes/user.routes");
app.use("/user", userRouter)

const reservationRoute = require("./routes/reservation.routes");
app.use("/reservations", isAuthenticated, reservationRoute)

require("./error-handling")(app);

module.exports = app;
