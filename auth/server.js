import express from "express";

const app = express();
const PORT = process.env.PORT || 8000

app.get('/', (req, res) => {
    res.send("It works")
})

app.listen(PORT , ()=>{
    console.log(`listening on port ${PORT}`)
})