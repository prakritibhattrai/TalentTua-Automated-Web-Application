import express from "express"
import http from "http"
import cors from "cors"
import bodyParser from "body-parser"
import db from "./config/db.js"
import dotenv from "dotenv"



dotenv.config()
const app = express()

app.use(cors())

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: true }))

app.get("/", (req, res) => {
    res.send("Hello World!")
})

const server = http.createServer(app)

server.listen(3000, () => {
    console.log("Server is running on port 3000")
})

export default server