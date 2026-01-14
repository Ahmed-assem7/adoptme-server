import express from "express"
import cors from "cors"

const app = express()
app.use(cors())
app.use(express.json())

let players = {}

app.post("/api/roblox", (req, res) => {
  players[req.body.username] = req.body
  res.send({ status: "saved" })
})

app.get("/api/test", (req, res) => {
  res.json(players)
})

app.listen(3000, () => {
  console.log("Server running")
})
