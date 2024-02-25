import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import Routes from "./routes/index.js"


const app = express();
const PORT = process.env.PORT || 8000

// Middlewares
app.use(express.json());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(cors());

app.get('/', (req, res) => {
    res.send("It works")
})

// routes

app.use(Routes)

app.listen(PORT , ()=>{
    console.log(`listening on port ${PORT}`)
})