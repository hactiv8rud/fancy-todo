if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const cors = require("cors");
const helmet            = require('helmet');
const noCache           = require('nocache');
const app = express();
const PORT = process.env.PORT || 3000;
const errorHandler = require("./middleware/errorHandler");
const routes = require("./routes");

app.use(cors());

app.use(helmet({
 referrerPolicy: {
    policy: ["same-origin"],
  },
  hsts: {
    maxAge: 0,
    force: true 
  },
  contentSecurityPolicy: {
    directives: { 
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'"], 
    }
  }
}));

app.use(noCache());

app.use(express.urlencoded( { extended: true }));
app.use(express.json());

app.use(routes);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log("App is running on PORT: ", PORT);
})