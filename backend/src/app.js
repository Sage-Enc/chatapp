import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE']
}));

app.use(express.json({
    limit: '16kb',
}));

app.use(express.urlencoded({
    extended: true,
    limit: '16kb'
}))

app.use(cookieParser())

import userRoutes from "./routes/user.route.js"

app.use('/api/v0/user',userRoutes)

export default app;