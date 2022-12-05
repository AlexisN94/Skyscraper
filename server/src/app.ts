import getFlights from "./routes/flights";
import checkConnection from "./middleware/check-connection";
import checkFlightUrl from "./middleware/check-flight-url";
import preparePage from "./middleware/prepare-page";
import checkDoingCaptcha from "./middleware/check-doing-captcha";

const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

app.locals.doingCaptcha = false;
app.locals.headless = true;

app.get(
  "/flights/",
  checkConnection,
  checkFlightUrl,
  checkDoingCaptcha,
  preparePage,
  getFlights
);
app.listen(4001);

module.exports = app;
