if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet            = require('helmet');
// const noCache           = require('nocache');
const errorHandler = require("./middleware/errorHandler");
const router = require("./routers");
const PORT = process.env.PORT || 3000;

const app = express();
// const corsOpts = {
//   origin: '*',
//   credential: true,
//   methods: [
//     'GET',
//     'POST',
//   ],
//   allowedHeaders: [
//     'Content-Type',
//   ],
// };

// app.use(cors(corsOpts));
app.use(cors({ 
    origin: 'https://cooperative-ware-holds-railroad.trycloudflare.com',
    credentials: true,
    // methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
}));
// app.use(helmet());    
// app.use(helmet({
//  referrerPolicy: {
//     policy: ["same-origin"],
//   },
//   hsts: {
//     maxAge: 0,
//     force: true 
//   },
//   contentSecurityPolicy: {
//     directives: { 
//       defaultSrc: ["'self'"],
//       scriptSrc: ["'self'", "'unsafe-inline'"],
//       styleSrc: ["'self'", "'unsafe-inline'"],
//       imgSrc: ["'self'"], 
//     }
//   }
// }));

// app.use(noCache());

app.use(express.urlencoded( { extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(router);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log("App is running on PORT: ", PORT);
})