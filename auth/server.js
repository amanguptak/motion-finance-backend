import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import Routes from "./routes/index.js";


import cookieParser from "cookie-parser";
const app = express();

const PORT = process.env.PORT || 8000;


// const corsOptions = {
//     origin: ['http://localhost:3000'],
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     credentials: true,
//     allowedHeaders : ['Content-Type', 'Authorization'],
//     optionsSuccessStatus: 200,

//   };
 
// Middlewares

upload.single('profile')
app.use(cookieParser());
app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

// routes

app.use(Routes);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
