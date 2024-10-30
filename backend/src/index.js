import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";

dotenv.config({
    path: './.env'
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 3000, ()=>{
        console.log("Listening on PORT:", process.env.PORT || 3000);
    })
}).catch((err)=>{
    console.log("MONGODB Connection Failed");
})