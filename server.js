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

app.get("/api/profile/:name", async (req,res)=>{
  const player = players[req.params.name]
  if(!player) return res.send({error:"No data yet"})

  const prompt = `
You are a cute gothic-style Adopt Me profile analyzer.

Player data:
${JSON.stringify(player)}

Generate:
- vibe (short aesthetic label)
- progressScore (0–100)
- flexLevel (Low, Medium, High, Insane)
- personality (soft gothic cute tone)
Return JSON only.
`

  const ai = await openai.chat.completions.create({
    model: "gpt-5.2",
    messages: [{ role: "user", content: prompt }]
  })

  res.send(JSON.parse(ai.choices[0].message.content))
})

app.listen(3000)
