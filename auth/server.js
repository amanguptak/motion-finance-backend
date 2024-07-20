import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import Routes from "./routes/index.js";
import dotenv from "dotenv"
import { Kafka } from 'kafkajs';

import cookieParser from "cookie-parser";
dotenv.config()
const app = express();


const PORT = process.env.PORT || 8000;

const kafka = new Kafka({
  clientId: 'user-service',
  brokers: ['localhost:9092']
});

const producer = kafka.producer();

const startProducer = async () => {
  await producer.connect();
};

startProducer();

// const corsOptions = {
//     origin: ['http://localhost:3000'],
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     credentials: true,
//     allowedHeaders : ['Content-Type', 'Authorization'],
//     optionsSuccessStatus: 200,

//   };
 
// Middlewares


app.use(cookieParser());
app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());


app.use((req, res, next) => {
  req.producer = producer;
  next();
});
// routes

app.use(Routes);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
