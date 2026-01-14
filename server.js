import express from "express"
import cors from "cors"

const app = express()
app.use(cors())
app.use(express.json())

// Health check (Railway uses this)
app.get("/", (req, res) => {
  res.send("OK")
})

// Debug endpoint
app.get("/api/test", (req, res) => {
  res.json({ status: "server alive" })
})

// IMPORTANT — Railway-safe port handling
const PORT = Number(process.env.PORT) || 3000

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port", PORT)
})
