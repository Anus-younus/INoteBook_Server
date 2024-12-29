import express from "express";
import "dotenv/config"
import ConnectDb from "./db.js";
import authRoutes from "./routes/authRoutes.js"
import notesRoutes from "./routes/notesRoutes.js"
import cors from "cors"
import authenticateUser from "./middlewares/authenticateUser.js";

const app = express()
const PORT = process.env.PORT
ConnectDb()

app.use(cors("*"))
app.use(express.json())
app.use("/auth", authRoutes)
app.use("/notes", authenticateUser, notesRoutes)



app.listen(PORT, () => {
    console.log(`PORT is running at http://localhost:${PORT}`)
})