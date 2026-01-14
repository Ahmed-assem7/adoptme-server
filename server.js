import express from "express"
import cors from "cors"
import OpenAI from "openai"

const app = express()
app.use(cors())
app.use(express.json())

const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY })

let players = {}

app.post("/api/roblox", (req,res)=>{
  players[req.body.username] = req.body
  res.send({status:"saved"})
})

app.get("/api/test", (req,res)=>{
  res.send(players)
})

app.get("/api/profile/:name", async (req,res)=>{
  const player = players[req.params.name]
  if(!player) return res.send({ error: "No data yet" })

  const prompt = `
You are a soft gothic cute Adopt Me profile analyzer.

Player data:
${JSON.stringify(player)}

Return JSON with:
- vibe
- progressScore (0–100)
- flexLevel (Low, Medium, High, Insane)
- personality
`

  try {
    cconst ai = await openai.responses.create({
  model: "gpt-5.2",
  input: prompt
})

const text = ai.output_text
res.send(JSON.parse(text))
})

app.listen(3000)
