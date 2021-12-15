require("dotenv/config");
require("./db");
const express = require("express");

const { isAuthenticated } = require("./middleware/jwt.middleware");

const app = express();
require("./config")(app);

// cloudinary routes
const index = require('./routes/index');
app.use('/', index); 
const picturesRouter = require('./routes/business.routes'); // <== has to be added
app.use('/api', picturesRouter); // <== has to be added


// 👇 Start handling routes here
const allRoutes = require("./routes");
app.use("/api", allRoutes);

const businessRouter = require("./routes/business.routes");
app.use("/business", businessRouter);

const authRouter = require("./routes/auth.routes");
app.use("/auth", authRouter);

const userRouter = require("./routes/user.routes");
app.use("/user", userRouter)
//had to remove isAuthenicated

const reservationRoute = require("./routes/reservation.routes");
app.use("/reservations", reservationRoute)

require("./error-handling")(app);

module.exports = app;
