import express from "express"
import {} from 'dotenv/config'
import { databaseRSOnline } from "./config/Database.js"
import router from "./routes/index.js"
import cookieParser from "cookie-parser"
import cors from "cors"

const app = express()

try {
    await databaseRSOnline.authenticate()
    console.log('database connected...')
} catch (error) {
    console.log(error)
}

app.use(cors( {credentials: true, origin: [process.env.ORIGIN]}))

// app.use(function(req, res, next){
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
//     res.setHeader('Access-Control-Allow-Credentials', true);
//     next();
// })

app.use(cookieParser())
app.use(express.json())
app.use(router)

app.listen(5000, () => {
    console.log("server running at port 5000")
})
