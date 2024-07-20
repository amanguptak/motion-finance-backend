import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { Kafka } from 'kafkajs';
import { handleUserRegister, handleUserLogin, handleUserLogout } from "./controllers/financeController.js";
import prisma from './prismaClient.js';
import financeRouter from './routes/financeRoute.js';

const app = express();
const PORT = process.env.PORT || 8001;

const kafka = new Kafka({
  clientId: 'finance-service',
  brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'finance-group' });

const runConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'user-register', fromBeginning: true });
  await consumer.subscribe({ topic: 'user-login', fromBeginning: true });
  await consumer.subscribe({ topic: 'user-logout', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      
      const userData = JSON.parse(message.value.toString());
      console.log(`Received message from user string on topic ${topic}: ${message.value.toString()}`);
      
      switch(topic) {
        case 'user-register':
          await handleUserRegister(userData);
          break;
        case 'user-login':
          await handleUserLogin(userData);
          break;
        case 'user-logout':
          await handleUserLogout(userData);
          break;
      }
    },
  });
};

runConsumer();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Use the finance router
app.use('/api/finance', financeRouter);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

// Test the database connection
prisma.$connect()
  .then(() => {
    console.log('Connected to PostgreSQL with Prisma successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

prisma.$disconnect()
  .catch(err => {
    console.error('Error disconnecting from the database:', err);
  });
